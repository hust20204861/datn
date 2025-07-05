const express = require('express');
const { createTask, updateTaskPriority,updateTaskEndDate, updateTaskStartDate, updateTaskDependencies, updateTaskAssignedTo, getUserTasks, getProjectTasks, updateTask, getTaskDetails, deleteTask } = require('../controllers/taskController');
const { createComment, getComments, updateComment, deleteComment, downloadFile, serveFile } = require('../controllers/commentController');
const { uploadComment } = require('../middlewares/uploadMiddleware');
const isLogin = require('../middlewares/isLogin');

const taskRouter = express.Router();

taskRouter.post("/", isLogin, createTask)
taskRouter.get('/user/tasks', isLogin, getUserTasks)
taskRouter.get('/:projectId/tasks', isLogin, getProjectTasks)
taskRouter.put('/:taskId', isLogin, updateTask)
taskRouter.put('/priority/:taskId', isLogin, updateTaskPriority)
taskRouter.put('/dependencies/:taskId', isLogin, updateTaskDependencies)
taskRouter.put('/assignedTo/:taskId', isLogin, updateTaskAssignedTo)
taskRouter.put('/startDate/:taskId', isLogin, updateTaskStartDate)
taskRouter.put('/endDate/:taskId', isLogin, updateTaskEndDate)
taskRouter.delete('/:taskId', isLogin, deleteTask)
taskRouter.get('/:taskId', isLogin, getTaskDetails)

// Comment routes - with file upload support
taskRouter.post("/comment/:taskId", isLogin, uploadComment.array('files', 5), createComment)
taskRouter.get("/comment/:taskId", isLogin, getComments)
taskRouter.put("/comment/:commentId", isLogin, updateComment)
taskRouter.delete("/comment/:commentId", isLogin, deleteComment)

// File routes
taskRouter.get("/comment/:commentId/file/:fileId/download", isLogin, downloadFile)
taskRouter.get("/comment/:commentId/file/:fileId/view", isLogin, serveFile)

module.exports = taskRouter;