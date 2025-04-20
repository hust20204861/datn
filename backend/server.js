const http = require("http");
const socketIo = require("socket.io");
const app = require("./app/app");
require("dotenv").config();
require("./config/dbConnect");

const cron = require("node-cron");
const TaskModel = require("./models/taskModel");

const port = process.env.PORT || 2024;

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Cấu hình socket.io
io.on("connection", (socket) => {
  console.log("New client connected");

  // Tham gia phòng dựa trên taskId
  socket.on("join-task", (taskId) => {
    socket.join(taskId);
    console.log(`Client joined task: ${taskId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

cron.schedule("*/10 * * * * *", async () => {
  const currentDate = new Date();
  const tasksToCheck = await TaskModel.find({
    status: { $ne: "DONE" },
    endAt: { $lt: currentDate },
  });

  tasksToCheck.forEach(async (task) => {
    task.isOverdue = true;
    await task.save();
    console.log(`Task ${task.name} is overdue.`);
  });

  const tasksToRemind = await TaskModel.find({
    status: { $ne: "DONE" },
    startAt: { $exists: true },
    endAt: { $exists: true },
  });

  tasksToRemind.forEach(async (task) => {
    const startAt = new Date(task.startAt);
    const endAt = new Date(task.endAt);

    const totalTime = endAt - startAt;

    const reminderTime = new Date(endAt.getTime() - totalTime / 10);

    if (reminderTime <= currentDate && currentDate < endAt) {
      if (!task.isRemindDeadline) {
        console.log(
          `Reminder: Task ${task._id} is due in 1/10 of its time window.`
        );

        task.isRemindDeadline = true;
        await task.save();
      }
    }
  });
});

// Thêm `io` vào `req` để các router có thể sử dụng
app.use((req, res, next) => {
  req.io = io;
  next();
});

const userRouter = require("./routers/userRouter");
const projectRouter = require("./routers/projectRouter");
const taskRouter = require("./routers/taskRouter");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/task", taskRouter);

server.listen(port, console.log(`Server is running on ${port}`));
