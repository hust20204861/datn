const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    require: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
},
{
  timestamps: true,
}
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
