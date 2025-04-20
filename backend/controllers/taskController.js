const TaskModel = require("../models/taskModel");
const HistoryModel = require("../models/historyModel");

//hàm tạo task cho project
exports.createTask = async (req, res) => {
  try {
    const {
      projectId,
      name,
      description,
      assignedTo,
      status,
      dueDate,
      priority,
      startAt,
      endAt,
      dependencies,
    } = req.body;

    const newTask = new TaskModel({
      projectId,
      name,
      description,
      assignedTo,
      status,
      dueDate,
      priority,
      startAt,
      endAt,
      dependencies,
    });

    await newTask.save();

    const previosState = null
    const newState = newTask.toObject()

    await saveHistory({
      entityId: newTask._id,
      entityType: "task",
      changeType: "createTask",
      changedBy: req.userAuth._id,
      previousState: previosState,
      newState: newState,
      changedAt: Date.now()
    })

    //truy xuất vào task đã lưu bằng id và liên kết với thông tin người dùng, lấy thông tin trừ password, sau đó trả ra kết quả
    await TaskModel.findById(newTask._id);
    return res.json({
      status: "success",
      message: "Create task success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Create task failed",
    });
  }
};

//hàm lấy các task của 1 project
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ assignedTo: req.userAuth._id });
    return res.json({
      status: "success",
      tasks,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      status: "failed",
      error: "Error",
    });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    //id project được truyền vào
    const { projectId } = req.params;
    console.log("PROJECT ID:", projectId);
    const tasks = await TaskModel.find({ projectId: projectId }).populate(
      "assignedTo",
      "-password"
    );
    // if(!tasks){
    //     return;
    // }

    const formattedTasks = tasks.map((task) => {
      return {
        ...task.toObject(),
        startAt: task.startAt ? task.startAt.toISOString().slice(0, 16) : null, // Định dạng startAt
        endAt: task.endAt ? task.endAt.toISOString().slice(0, 16) : null, // Định dạng endAt
      };
    });

    return res.json({
      status: "success",
      tasks: formattedTasks,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error,
    });
  }
};

exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log(taskId);
    const task = await TaskModel.findById(taskId)
      .populate({
        path: "assignedTo",
        select: "-password",
      })
      .populate({
        path: "projectId",
        select: "_id name manager description",
        populate: {
          path: "manager",
          select: "_id name username",
        },
      });
    return res.json({
      status: "success",
      task,
    });
  } catch (error) {
    console.error("Get Task Detail Error:", error);
    return res.json({
      status: "failed",
      error: "Get Task Failed",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const {
      // projectId,
      // name,
      // description,
      // assignedTo,
      status,
      // dueDate,
      // priority,
    } = req.body;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.json({
        status: "failed",
        error: "Task not found",
      });
    }

    if (task.locked) {
      return res.json({
        status: "failed",
        error: "Task can be updated only when it is not locked",
      });
    }

    const previousState = task.toObject();

    task.locked = true;
    await task.save();

    const dependentTasks = await TaskModel.find({
      _id: { $in: task.dependencies },
    });

    for (const depTask of dependentTasks) {
      if (depTask.status !== "DONE") {
        task.locked = false;
        await task.save();

        return res.json({
          status: "failed",
          error: `Task cannot be updated to ${status} because dependent task (${depTask.name}) is not done.`,
        });
      }
    }

    task.status = status;
    await task.save();

    task.locked = false;
    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updateStatus",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    req.io.to(taskId).emit("task-updated-status", {
      taskId: task._id,
      status: task.status,
    });

    return res.json({
      status: "success",
      message: "Update Task Success",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

exports.updateTaskDependencies = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { dependencies } = req.body;
    const task = await TaskModel.findById(taskId);

    const previousState = task.toObject();

    const dependentTasks = await TaskModel.find({ _id: { $in: dependencies } });

    for (const depTask of dependentTasks) {
      if (new Date(depTask.endAt) >= new Date(task.startAt)) {
        return res.json({
          status: "failed",
          error: `Task cannot start before its dependent task (${depTask.name}) ends.`,
        });
      }
    }

    task.dependencies = dependencies;

    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updateDependencies",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    req.io.to(taskId).emit("task-updated-dependencies", {
      taskId: task._id,
      dependencies: task.dependencies,
    });

    return res.json({
      status: "success",
      message: "Update Task Success",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

exports.updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;
    const task = await TaskModel.findByIdAndUpdate(taskId);

    const previousState = task.toObject();

    console.log("PREVIOUS STATE:", previousState);

    task.priority = priority;

    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updatePriority",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    req.io.to(taskId).emit("task-updated-priority", {
      taskId: task._id,
      priority: priority,
    });

    return res.json({
      status: "success",
      message: "Update Task Success",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

exports.updateTaskAssignedTo = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;

    const task = await TaskModel.findByIdAndUpdate(taskId);

    const previousState = task.toObject();

    task.assignedTo = assignedTo;

    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updateAssignedTo",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    const taskUpdated = await TaskModel.findById(
      taskId
    )
      .populate({
        path: "assignedTo",
        select: "-password",
      })
      .populate({
        path: "projectId",
        select: "_id name manager description",
        populate: {
          path: "manager",
          select: "_id name username",
        },
      });

    req.io.to(taskId).emit("task-updated-assignedTo", {
      taskId: taskUpdated._id,
      assignedTo: taskUpdated.assignedTo,
    });
    return res.json({
      status: "success",
      message: "Update Task Success",
      task: taskUpdated,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

exports.updateTaskStartDate = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { startAt } = req.body;
    const task = await TaskModel.findByIdAndUpdate(taskId);

    const previousState = task.toObject();

    task.startAt = startAt;

    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updateStartAt",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    req.io.to(taskId).emit("task-updated-startAt", {
      taskId: task._id,
      startAt: startAt,
    });
    return res.json({
      status: "success",
      message: "Update Task Success",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

exports.updateTaskEndDate = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { endAt } = req.body;
    const task = await TaskModel.findById(taskId);

    if (new Date(endAt) <= new Date(task.startAt)) {
      return res.json({
        status: "failed",
        error: `Task EndDate must be greater than StartDate`,
      });
    }

    const previousState = task.toObject();

    task.endAt = endAt;

    await task.save();

    await saveHistory({
      entityId: task._id,
      entityType: "task",
      changeType: "updateEndAt",
      changedBy: req.userAuth._id,
      previousState: previousState,
      newState: task.toObject(),
      changedAt: Date.now()
    })

    req.io.to(taskId).emit("task-updated-endAt", {
      taskId: task._id,
      endAt: task.endAt,
    });
    return res.json({
      status: "success",
      message: "Update Task Success",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.json({
      status: "failed",
      error: "Update Task Failed",
    });
  }
};

// exports.deleteTask = async (req, res) => {
//   const { id } = req.params;
//   TaskModel.findByIdAndDelete(id)
//     .then(() => res.json({ error: null }))
//     .catch((error) => res.json({ error: error.message }));
// };
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  console.log("TASK ID", taskId);
  try {
    // Kiểm tra xem task có tồn tại hay không
    const task = await TaskModel.findByIdAndDelete(taskId);

    if (!task) {
      // Nếu task không tồn tại, trả về lỗi 404
      return res.status(404).json({
        status: "failed",
        error: "Task not found",
      });
    }

    // Trả về phản hồi thành công
    return res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    // Xử lý lỗi server
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      status: "failed",
      error: "Delete Task Failed",
    });
  }
};

exports.commentOnTask = async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  TaskModel.findByIdAndUpdate(id, {
    $push: {
      comments: {
        author,
        content,
      },
    },
  })
    .then(() => res.json({ error: null }))
    .catch((error) => res.json({ error }));
};


const saveHistory = async (data) => {

  const history = new HistoryModel(data);

  await history.save();
}

