const express = require('express');
const { 
    createProject, 
    getProjectHistory, 
    getProjects, 
    getProjectDetails, 
    updateProject, 
    deleteProject, 
    deleteAllProjects, 
    getProjectsMember, 
    getMembersOfProject,
    addMemberToProject
} = require('../controllers/projectController')

const { 
    createGroup, 
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupDetails,
    getGroupMembers,
    updateGroup,
    deleteGroup,
    selectGroupLeader,
    getGroupsOfProject,
    deleteLeader
} = require('../controllers/groupController')
const isLogin = require('../middlewares/isLogin')
const projectRouter = express.Router();

projectRouter.post('/create', isLogin, createProject)
projectRouter.get('/', isLogin, getProjects)
projectRouter.get('/member', isLogin, getProjectsMember)
projectRouter.get('/:projectId', isLogin, getProjectDetails)
projectRouter.put('/:projectId', isLogin, updateProject)
projectRouter.delete('/:projectId', isLogin, deleteProject)
projectRouter.get('/:projectId/members', isLogin, getMembersOfProject)
projectRouter.get('/:projectId/histories', isLogin, getProjectHistory)
projectRouter.get('/project/addmember', isLogin, addMemberToProject)


projectRouter.post('/group/create', isLogin, createGroup)
projectRouter.get('/group/:groupId', isLogin, getGroupDetails)
projectRouter.get('/group/:groupId/members', isLogin, getGroupMembers)
projectRouter.put('/group/:groupId', isLogin, updateGroup)
projectRouter.delete('/group/:groupId', isLogin, deleteGroup)
projectRouter.post('/group/:groupId/selectLeader', isLogin, selectGroupLeader)
projectRouter.post('/group/:groupId/addMember', isLogin, addMemberToGroup)  
projectRouter.post('/group/:groupId/removeMember', isLogin, removeMemberFromGroup)
projectRouter.get('/:projectId/groups', isLogin, getGroupsOfProject)
projectRouter.post('/group/:groupId/deleteLeader', isLogin, deleteLeader)

module.exports = projectRouter;
