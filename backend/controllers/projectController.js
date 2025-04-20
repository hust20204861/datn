const ProjectModel = require("../models/projectModel");

exports.createProject = async (req, res) => {
    try{
        const { name, description, members } = req.body;
        if(!name || !description){
            return res.status(400).json({
                status: "Create project failed",
                error: "Missing name or description"
            })
        }
        const newProject = new ProjectModel({
          name,
          description,
          manager: req.userAuth._id,
          members
        });
      
        await newProject.save()

        return res.status(200).json({
            status: "Create project success",
            message: "Create Project Success",
            newProject
        })
    }catch(error){
        return res.json({
            status: "Create project failed",
            error: "Create Project Failed"
        })
    }
};

exports.getProjects = async (req, res) => {
  try{
    console.log("ID", req.userAuth._id)
    const projects = await ProjectModel.find({ manager: req.userAuth._id })
    // .populate({
    //     path: "manager",
    //     select: "_id name",
    //   });
    console.log("PROJECTS:",projects)
    return res.json({
      status: "success",
      projects
    });
  }catch(error){
    console.error("get pjs failed:", error);
    return res.json({
      status: "failed",
      error: "Internal server error"
    })
  }
};

exports.getProjectsMember = async (req, res) => {
  try{
    console.log("ID", req.userAuth._id)
    const projects = await ProjectModel.find({ 
      members: req.userAuth._id ,
      manager: { $ne: req.userAuth._id } 
    })
    // .populate({
    //     path: "manager",
    //     select: "_id name",
    //   });
    console.log("PROJECTS:",projects)
    return res.json({
      status: "success",
      projects
    });
  }catch(error){
    console.error("get pjs failed:", error);
    return res.json({
      status: "failed",
      error: "Internal server error"
    })
  }
};

exports.getProjectDetails = async (req, res) => {
  try{
    const { projectId } = req.params
    const project = await ProjectModel.findOne({
        _id: projectId ,
        manager: req.userAuth._id ,
    })    
    .populate({
        path: "manager",
        select: "_id name username",
      })
    return res.json({
      status: "success",
      project
    });
  }catch(error){
    console.error("get pjs failed:", error);
    return res.json({
      status: "failed",
      error: "Internal server error"
    })
  }
};

exports.getMembersOfProject = async (req, res) => {
  try{
    const { projectId } = req.params
    const project = await ProjectModel.findOne({
        _id: projectId ,
    })
    .populate({
      path: "members",
      select: "_id name username",
    })
    return res.json({
      status: "success",
      data: project
    });
  }catch(error){
    console.error("get members failed:", error);
    return res.json({
      status: "failed",
      error: "Internal server error"
    })
  }
};
    

exports.updateProject = async (req, res) => {
    try{
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId)
          .populate({
            path: "manager",
            select: "-password",
          })
        const isManager = project.manager._id.toString() == req.userAuth._id.toString();
        if (!isManager) {
          return res.json({
            status: "failed",
            error: "You are not the manager.",
          });
        }
        const { name, description, manager, members } = req.body;

        const updateProject = await ProjectModel.findByIdAndUpdate(projectId, {
          name,
          description,
          manager,
          members
        },
      {
        new: true,
      }).populate({
        path: "members",
        select: "_id name username"
      });

        return res.json({
          status: "update success",
          updateProject
        })
    }catch(error){
        console.error("Update Project Error:", error)
        return res.json({
            status: "failed",
            error: "Update Project failed"
        })
    }
};

exports.deleteProject = async (req, res) => {
    try{
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId);

        const isManager = project.manager._id.toString() == req.userAuth._id.toString();
        console.log()
        if (!isManager)
          return res.json({
            error: "Delete Project Failed. You're not Manager",
          });
      
        await ProjectModel.findByIdAndDelete(projectId);

          return res.json({
              status: "success",
              message: "Delete Project Success"
          })
    }catch(error){
        return res.json({
            status: "failed",
            error: "Delete Project Failed"
        })
    }

};

exports.deleteAllProjects = async (req, res) => {
  ProjectModel.deleteMany({})
    .then(() => res.json({ error: null }))
    .catch((error) => res.json({ error }));
};

exports.addMembersToProject = async (req, res) => {
  const { projectId } = req.params;
  const { members } = req.body;

  const project = await ProjectModel.findById(id);
  const isManager = project.manager == req.userAuth.id;
  if (!isManager)
    return res.json({
      error: new Error("Only manager can update this project"),
    });

  ProjectModel.findByIdAndUpdate(projectId, {
    $push: {
      members,
    },
  })
    .then((project) => res.json({ project, error: null }))
    .catch((error) => res.json({ error }));
};
