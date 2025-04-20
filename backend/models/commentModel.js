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
},
{
  timestamps: true,
}
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
