const http = require("http");
const socketIo = require("socket.io");
const app = require("./app/app");
require("dotenv").config();
require("./config/dbConnect");
const nodemailer = require('nodemailer');

const cron = require("node-cron");
const TaskModel = require("./models/taskModel");
const UserModel = require("./models/userModel");

const port = process.env.PORT || 2024;

const server = http.createServer(app);

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'vieva2k2@gmail.com',  
    pass: 'ojrm wfzr roqa totn',     
  }
});


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

cron.schedule("*/15 * * * * *", async () => {
  const currentDate = new Date();
  const tasksToCheck = await TaskModel.find({
    status: { $ne: "DONE" },
    endAt: { $lt: currentDate },
  });

  tasksToCheck.forEach(async (task) => {
    if(!task.isOverdue){
      task.isOverdue = true;
      await task.save();
      console.log(`Task ${task.name} is overdue.`);

      for (let i = 0; i < task.assignedTo.length; i++) {
        const user = await UserModel.findOne({ _id: task.assignedTo[i] }); 

        const mailOptions = {
          from: 'vieva2k2@gmail.com', 
          to: user.username, 
          subject: `Reminder: Task ${task.name} is Over Due`,  
          text: `Dear user, the task "${task.name}" is over due. Please check it.`,  
          html: `<p>Dear user,</p><p>The task <strong>"${task.name}"</strong> is over due. Please check it.</p>`  
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error occurred while sending reminder email:', error);
          } else {
            console.log('Reminder email sent:', info.response);
          }
        });
      }

      
    }
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

        for (let i = 0; i < task.assignedTo.length; i++) {
          const user = await UserModel.findOne({ _id: task.assignedTo[i] }); 
  
          const mailOptions = {
            from: 'vieva2k2@gmail.com', 
            to: user.username, 
            subject: `Reminder: Task ${task.name} is Due Soon`,  
            text: `Dear user, the task "${task.name}" is over due. Please ensure it's completed in time.`,  
            html: `<p>Dear user,</p><p>The task <strong>"${task.name}"</strong> is Due Soon. Please ensure it's completed in time.</p>`  
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error occurred while sending reminder email:', error);
            } else {
              console.log('Reminder email sent:', info.response);
            }
          });
        }
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
