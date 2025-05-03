const GroupModel = require("../models/groupModel");
const UserModel = require("../models/userModel");

exports.createGroup = async (req, res) => {
  try {
    const { name, description, projectId } = req.body;

    const group = new GroupModel({
      name,
      description,
      project: projectId,
      lead: null,
      members: [],
    });

    await group.save();

    return res.json({
        status: "success",
        message: "Create group success",
      });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Create group failed",
    });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {
    const { groupId, userIds } = req.body;

    console.log("::::ADD MEMBER TO GROUP",groupId, userIds)

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    const users = await UserModel.find({ '_id': { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.json({
        status: "failed",
        error: "One or more users not found",
      });
    }

    const alreadyInGroup = userIds.filter(userId => group.members.includes(userId));
    if (alreadyInGroup.length > 0) {
      return res.json({
        status: "failed",
        error: `Users already in group: ${alreadyInGroup.join(', ')}`,
      });
    }

    group.members.push(...userIds);

    await group.save();

    return res.json({
      status: "success",
      message: "Add member to group success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Add member to group failed",
    });
  }
};

exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({
        status: "failed",
        error: "User not found",
      });
    }

    const index = group.members.indexOf(userId);
    if (index === -1) {
      return res.json({
        status: "failed",
        error: "User not in group",
      });
    }

    group.members.splice(index, 1);

    if(group.lead === userId){
        group.lead = null
    }

    await group.save();

    return res.json({
      status: "success",
      message: "Remove member from group success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Remove member from group failed",
    });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    return res.json({
      status: "success",
      group,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Get group details failed",
    });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    const members = await UserModel.find({ '_id': { $in: group.members } });

    return res.json({
      status: "success",
      members,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Get group members failed",
    });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    group.name = name;
    group.description = description;

    await group.save();

    return res.json({
      status: "success",
      message: "Update group success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Update group failed",
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    await group.remove();

    return res.json({
      status: "success",
      message: "Delete group success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Delete group failed",
    });
  }
};

exports.selectGroupLeader = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.json({
        status: "failed",
        error: "Group not found",
      });
    }

    group.lead = userId;

    await group.save();

    return res.json({
      status: "success",
      message: "Select group leader success",
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Select group leader failed",
    });
  }
};

exports.getGroupsOfProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const groups = await GroupModel.find({ project: projectId })
    .populate("members", "_id name username")
    .populate("lead", "_id name username");

    return res.json({
      status: "success",
      groups,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      error: "Get groups of project failed",
    });
  }
};