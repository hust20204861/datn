import fetchApi from "./baseApi";

export const Signin = async ({username, password}) => {
    try{
      const response = await fetch('http://localhost:2024/api/v1/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    // console.log("DATA SIGNIN", data)
    if (response.ok && data.status === 'success') {
      localStorage.setItem('accessToken', data.accessToken);
    }
    // if (response.ok && data.status === 'signin failed') {
    //     alert(data.error)
    //   }
      return data;

  }catch(error){
    console.error('Sign error:', error.message);
    throw error;
  }
  };

export const Signup = async ({name, username, password}) => {
  try{
    const response = await fetch('http://localhost:2024/api/v1/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, password }),
  });
  const data = await response.json();
  // console.log("DATA SIGNUP", data)
  if (response.ok && data.status === 'success') {
    alert("SIGNUP SUCCESS")
  }
  if (response.ok && data.status === 'signin failed') {
      alert(data.error)
    }
    return data;

}catch(error){
  console.error('Sign error:', error.message);
  throw error;
  }
};

  export const getUsers = async() => {
    try{
        const data = await fetchApi('/api/v1/user');
        // console.log("USERS:", data)
        return data;
    }catch(error){
        console.error("GET USERS ERROR:", error)
    }
  }

  export const getProjectsManager = async() => {
    try{
        const data = await fetchApi('/api/v1/project')
        // console.log("PROJECTS:", data)
        return data;
    }catch(error){
        console.error('Projects error:', error.message);
        throw error;
    }
  }

  export const getProjectsMember = async() => {
    try{
        const data = await fetchApi('/api/v1/project/member')
        // console.log("PROJECTS MEMBER:", data)
        return data;
    }catch(error){
        console.error('Projects error:', error.message);
        throw error;
    }
  }

  export const getProjectTask = async(projectId) => {
    try{
      const data = await fetchApi(`/api/v1/task/${projectId}/tasks`)
      return data;
    }catch(error){
        console.error('Projects error:', error.message);
        throw error;
    }
  }

  export const createProject = async({ name, description, members }) => {
    try{
        const data = fetchApi('/api/v1/project/create', 'POST', { name, description, members })
        return data
    }catch(error){
        console.error("CREATE PROJECT ERROR:", error)
    }
  }

  export const deleteProject = async(projectId) => {
    try{
      const data = await fetchApi(`/api/v1/project/${projectId}`, 'DELETE')
      console.log("DELETE PROJECT DATA", data)
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const getProjectHistory = async(projectId) => {
    try{
      const data = await fetchApi(`/api/v1/project/${projectId}/histories`)
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const getMembersOfProject = async(projectId) => {
    try{
        const data = await fetchApi(`/api/v1/project/${projectId}/members`);
        console.log("MEMBERS:", projectId)
        return data;
    }catch(error){
        console.error("GET USERS ERROR:", error)
    }
  }

  export const getUserTasks = async() => {
    try{
        const data = await fetchApi('/api/v1/task/user/tasks')
        return data;
    }catch(error){
        console.error('Tasks error:', error.message);
        throw error;
    }
  }

  export const getTaskDetail = async(taskId) => {
    try{
      const data = await fetchApi(`/api/v1/task/${taskId}`)
      return data;
    }catch(error){
        console.error('TaskDetail error:', error.message);
        throw error;
    }
  }

  export const createComment = async({content,taskId}) => {
    try{
      const data = await fetchApi(`/api/v1/task/comment/${taskId}`, 'POST', {content})
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }
  export const getComments = async(taskId) => {
    try{
      const data = await fetchApi(`/api/v1/task/comment/${taskId}`)
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const updateTask = async({taskId, status}) => {
    try{
      const data = await fetchApi(`/api/v1/task/${taskId}`, 'PUT', {status})
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const updateTaskPriority = async({taskId, priority}) => {
    try{
      const data = await fetchApi(`/api/v1/task/priority/${taskId}`, 'PUT', {priority})
      return data;
    }catch(error){
        console.error('update priority error:', error.message);
        throw error;
    }
  }

  export const updateTaskDependencies = async({taskId, dependencies}) => {
    try{
      const data = await fetchApi(`/api/v1/task/dependencies/${taskId}`, 'PUT', {dependencies})
        console.log("DATA", data)
      return data;
    }catch(error){
        console.error('update priority error:', error.message);
        throw error;
    }
  }

  export const updateTaskAssignedTo = async({taskId, assignedTo}) => {
    try{
      const data = await fetchApi(`/api/v1/task/assignedTo/${taskId}`, 'PUT', {assignedTo})
      return data;
    }catch(error){
        console.error('update priority error:', error.message);
        throw error;
    }
  }

  export const updateTaskStartDate = async({taskId, startAt}) => {
    try{
      const data = await fetchApi(`/api/v1/task/startDate/${taskId}`, 'PUT', {startAt})
      return data;
    }catch(error){
        console.error('update priority error:', error.message);
        throw error;
    }
  }

  export const updateTaskEndDate = async({taskId, endAt}) => {
    try{
      const data = await fetchApi(`/api/v1/task/endDate/${taskId}`, 'PUT', {endAt})
      return data;
    }catch(error){
        console.error('update priority error:', error.message);
        throw error;
    }
  }

  export const deleteTask = async(taskId) => {
    try{
      console.log("TASK ID", `/api/v1/task/${taskId}`)
      const data = await fetchApi(`/api/v1/task/${taskId}`, 'DELETE')
      console.log("DELETE DATA", data)
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const createTask = async({projectId,
                                  name,
                                  description,
                                  assignedTo,
                                  status,
                                  dueDate,
                                  priority,
                                  startAt,
                                  endAt,
                                  dependencies,
                                  parentTask}) => {
    try{
      const data = await fetchApi(`/api/v1/task/`, 'POST', 
      { projectId,
        name,
        description,
        assignedTo,
        status,
        dueDate,
        priority,
        startAt,
        endAt,
        dependencies,
        parentTask
      })
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

export const CreateGroup = async({name, description, projectId}) => {
  try{
    const data = await fetchApi('/api/v1/project/group/create', 'POST', { name, description, projectId })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const AddMemberToGroup = async({groupId, userIds}) => {
  try{
    console.log("USER IDS",groupId, userIds)
    const data = await fetchApi(`/api/v1/project/group/${groupId}/addMember`, 'POST', { groupId,userIds })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const RemoveMemberFromGroup = async({groupId, userId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}/removeMember`, 'POST', { userId })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const SelectGroupLeader = async({groupId, userId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}/selectLeader`, 'POST', { userId })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}
export const GetGroupDetails = async({groupId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}`)
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const GetGroupMembers = async({groupId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}/members`)
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const UpdateGroup = async({groupId, name, description}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}`, 'PUT', { name, description })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const DeleteGroup = async({groupId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}`, 'DELETE')
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const GetGroupsOfProject = async({projectId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/${projectId}/groups`)
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const DeleteLeader = async({groupId}) => {
  try{
    const data = await fetchApi(`/api/v1/project/group/${groupId}/deleteLeader`, 'POST')
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}
