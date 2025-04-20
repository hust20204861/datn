const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar_url: String,
},
{
  timestamps: true,
}
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
