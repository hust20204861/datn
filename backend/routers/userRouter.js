const express = require('express');

const { createUser, signIn, signOut, getUsers, updateUser, getUser } = require('../controllers/userController');
const isLogin = require('../middlewares/isLogin')

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/signin', signIn);
userRouter.post('/signout', signOut);
userRouter.get('/', isLogin, getUsers);
userRouter.get('/profile',isLogin, getUser)
userRouter.put('/update', isLogin, updateUser)
    
module.exports = userRouter;

