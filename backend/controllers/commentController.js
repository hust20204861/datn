const CommentModel = require("../models/commentModel");

exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    // Tạo comment mới
    const newComment = new CommentModel({
      task: taskId,
      author: req.userAuth._id,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await newComment.save();

    // Populate dữ liệu author
    const comment = await CommentModel.findById(newComment._id).populate({
      path: "author",
      select: "-password",
    });

    // Phát sự kiện qua WebSocket
    req.io.to(taskId).emit("new-comment", comment);
    console.log("New comment emitted to room:", taskId, comment);

    // Trả về response
    res.json({ comment, error: null });
  } catch (error) {
    // Xử lý lỗi
    console.error("Error creating comment:", error.message);
    res.status(500).json({ comment: null, error: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId)
    return res.json({ comments: null, error: "taskId must be provided" });

  CommentModel.find({ task: taskId })
    .populate({
      path: "author",
      select: "-password",
    })
    .exec()
    .then((comments) => res.json({ comments, error: null }))
    .catch((error) => res.json({ comments: null, error: error.message }));
};

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  CommentModel.findByIdAndUpdate(commentId, { content, updatedAt: Date.now() })
    .then((comment) => res.json({ comment, error: null }))
    .catch((error) => res.json({ comment: null, error: error.message }));
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  CommentModel.findByIdAndDelete(commentId)
    .then(() => res.json({ error: null }))
    .catch((error) => res.json({ error: error.message }));
};
