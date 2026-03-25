import fetchApi from "./baseApi";

export const Signin = async ({username, password}) => {
    try{
      const response = await fetch('http://test.edu/manager_be/api/v1/user/signin', {
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
    const response = await fetch('http://test.edu/manager_be/api/v1/user/signup', {
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

export const getUser = async() => {
  try{
      const data = await fetchApi('/api/v1/user/profile');
      // console.log("USERS:", data)
      return data;
  }catch(error){
      console.error("GET USERS ERROR:", error)
  }
}

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
    console.log("CONTENT", content)
    try{
      const data = await fetchApi(`/api/v1/task/comment/${taskId}`, 'POST', {content})
      return data;
    }catch(error){
        console.error('comment error:', error.message);
        throw error;
    }
  }

  export const createCommentWithFiles = async({content, taskId, files}) => {
    try{
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      
      // Thêm content vào FormData
      if (content) {
        formData.append('content', content);
      }
      
      // Thêm files vào FormData
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }
      
      const response = await fetch(`http://localhost:2024/api/v1/task/comment/${taskId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Không set Content-Type với FormData, browser sẽ tự set với boundary
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    }catch(error){
        console.error('comment with files error:', error.message);
        throw error;
    }
  }

  export const downloadFile = async(commentId, fileId) => {
    try{
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:2024/api/v1/task/comment/${commentId}/file/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Lấy filename từ Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download';
      
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }
      
      const blob = await response.blob();
      
      // Tạo URL tạm thời và trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    }catch(error){
        console.error('download file error:', error.message);
        throw error;
    }
  }

  export const getFileUrl = (commentId, fileId) => {
    return `http://localhost:2024/api/v1/task/comment/${commentId}/file/${fileId}/view`;
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
  export const updateUser = async(postData) => {
    try{
      const name = JSON.parse(postData).name
      const avatar_url = JSON.parse(postData).avatar_url
      const data = await fetchApi(`/api/v1/user/update`, 'PUT', {name, avatar_url})
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
                                  parentTask,
                                  userId}) => {
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
        parentTask,
        userId
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
export const AddMemberToProject = async({projectId, username}) => {
  try{
    const data = await fetchApi(`/api/v1/project/addmember`, 'POST', { projectId, username })
    console.log(data)
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}

export const changePasswordApi = async({currentPassword, newPassword, username}) => {
  try{
    const data = await fetchApi(`/api/v1/user/change-password`, 'POST', { currentPassword, newPassword, username })
    return data;
  }catch(error){
      console.error('group error:', error.message);
      throw error;
  }
}
