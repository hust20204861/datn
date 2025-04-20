const express = require('express');
const { createProject, getProjects, getProjectDetails, updateProject, deleteProject, deleteAllProjects, getProjectsMember, getMembersOfProject } = require('../controllers/projectController')
const isLogin = require('../middlewares/isLogin')
const projectRouter = express.Router();

projectRouter.post('/create', isLogin, createProject)
projectRouter.get('/', isLogin, getProjects)
projectRouter.get('/member', isLogin, getProjectsMember)
projectRouter.get('/:projectId', isLogin, getProjectDetails)
projectRouter.put('/:projectId', isLogin, updateProject)
projectRouter.delete('/:projectId', isLogin, deleteProject)
projectRouter.get('/:projectId/members', isLogin, getMembersOfProject)


module.exports = projectRouter;
