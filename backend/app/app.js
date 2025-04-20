const express = require('express')
const morgan = require('morgan')
const cors = require('cors');

// const userRouter = require('../routers/userRouter');
// const projectRouter = require('../routers/projectRouter');
// const taskRouter = require('../routers/taskRouter')

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// app.use('/api/v1/user', userRouter);
// app.use('/api/v1/project', projectRouter);
// app.use('/api/v1/task', taskRouter)

module.exports = app;