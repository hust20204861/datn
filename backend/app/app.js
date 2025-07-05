const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const userRouter = require('../routers/userRouter');
const projectRouter = require('../routers/projectRouter');
const taskRouter = require('../routers/taskRouter');

const app = express();

// Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware để inject io vào req - PHẢI ĐẶT TRƯỚC ROUTES
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Static file serving cho uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/task', taskRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room để nhận updates cho specific task
  socket.on('join-task', (taskId) => {
    socket.join(taskId);
    console.log(`User ${socket.id} joined task room: ${taskId}`);
  });

  // Leave room khi user không còn xem task
  socket.on('leave-task', (taskId) => {
    socket.leave(taskId);
    console.log(`User ${socket.id} left task room: ${taskId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, server };