const CommentModel = require("../models/commentModel");
const path = require('path');
const fs = require('fs');
const { getFileType } = require('../middlewares/uploadMiddleware');

exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    // Kiểm tra xem có content hoặc files không
    if ((!content || content.trim() === '') && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        status: "failed",
        error: "Comment must have content or files"
      });
    }

    // Xử lý file attachments nếu có
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        fileType: getFileType(file.mimetype),
        mimeType: file.mimetype,
        uploadedAt: new Date()
      }));
    }

    // Tạo comment mới
    const newComment = new CommentModel({
      task: taskId,
      author: req.userAuth._id,
      content: content ? content.trim() : "", // Cho phép comment chỉ có file
      attachments: attachments
    });

    await newComment.save();

    // Populate dữ liệu author
    const comment = await CommentModel.findById(newComment._id).populate({
      path: "author",
      select: "-password",
    });

    // Phát sự kiện qua WebSocket
    if (req.io) {
      req.io.to(taskId).emit("new-comment", comment);
      console.log("New comment emitted to room:", taskId);
    }

    // Trả về response
    res.json({ 
      status: "success",
      comment, 
      error: null 
    });
  } catch (error) {
    // Xử lý lỗi - xóa files đã upload nếu có lỗi
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      });
    }

    console.error("Error creating comment:", error.message);
    res.status(500).json({ 
      status: "failed",
      comment: null, 
      error: error.message 
    });
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
  try {
    const { commentId } = req.params;
    
    // Tìm comment để lấy thông tin files
    const comment = await CommentModel.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        status: "failed",
        error: "Comment not found" 
      });
    }

    // Xóa files liên quan
    if (comment.attachments && comment.attachments.length > 0) {
      comment.attachments.forEach(attachment => {
        if (fs.existsSync(attachment.filePath)) {
          fs.unlinkSync(attachment.filePath);
        }
      });
    }

    // Xóa comment
    await CommentModel.findByIdAndDelete(commentId);
    
    res.json({ 
      status: "success",
      error: null 
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ 
      status: "failed",
      error: error.message 
    });
  }
};

// Thêm method để download file
exports.downloadFile = async (req, res) => {
  try {
    const { commentId, fileId } = req.params;
    
    // Tìm comment
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        status: "failed",
        error: "Comment not found" 
      });
    }

    // Tìm file trong attachments
    const attachment = comment.attachments.id(fileId);
    if (!attachment) {
      return res.status(404).json({ 
        status: "failed",
        error: "File not found" 
      });
    }

    // Kiểm tra file có tồn tại trên server không
    if (!fs.existsSync(attachment.filePath)) {
      return res.status(404).json({ 
        status: "failed",
        error: "File not found on server" 
      });
    }

    // Set headers và gửi file
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    
    res.sendFile(path.resolve(attachment.filePath));
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).json({ 
      status: "failed",
      error: error.message 
    });
  }
};

// Thêm method để serve file (view inline)
exports.serveFile = async (req, res) => {
  try {
    const { commentId, fileId } = req.params;
    
    // Tìm comment
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        status: "failed",
        error: "Comment not found" 
      });
    }

    // Tìm file trong attachments
    const attachment = comment.attachments.id(fileId);
    if (!attachment) {
      return res.status(404).json({ 
        status: "failed",
        error: "File not found" 
      });
    }

    // Kiểm tra file có tồn tại trên server không
    if (!fs.existsSync(attachment.filePath)) {
      return res.status(404).json({ 
        status: "failed",
        error: "File not found on server" 
      });
    }

    // Set headers và gửi file
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.originalName}"`);
    
    res.sendFile(path.resolve(attachment.filePath));
  } catch (error) {
    console.error("Error serving file:", error.message);
    res.status(500).json({ 
      status: "failed",
      error: error.message 
    });
  }
};
