const bcrypt = require("bcryptjs");
const UserModel = require('../models/userModel');
const generateToken = require('../services/generateToken');
const verifyToken = require('../services/verifyToken');

//hàm tạo user mới
exports.createUser = async (req, res) => {
  try {
    //lấy thông tin 
    const { name, username, password } = req.body;
    if(!name || !username || !password){
      return res.status(400).json({
        status: "failed",
        error: "Complete your info, please"
      })
    }
    //kiểm tra xem usename đã tồn tại hay chưa
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.json({ error: "Username has been used" });
    }
  //băm mật khẩu để bảo mật
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //tạo user mới với name, username, password đã băm
    const newUser = new UserModel({
      name,
      username,
      password: hashedPassword,
    });
    //lưu dữ liệu vào database
    await newUser.save();
  
    return res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return res.json({ status: 'failed', error: error.message });
  }
};

//hàm đang nhập
exports.signIn = async (req, res) => {
  try {
    //lấy dữ liệu người dùng nhập vào
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).json({
        status: "singin failed",
        error: "Missing username or password"
      })
    }
    //kiểm tra xem username tồn tại không
    const user = await UserModel.findOne({ username });
    //không tồn tại trả về lỗi
    if (!user) {
      return res.json({ status: "signin failed", error: "User not existed" });
    }
    const isPassword = bcrypt.compareSync(password, user.password);
    if(!isPassword){
      return res.status(401).json({ status:'singin failed', error : 'Invalid password'})
    }
    const { accessToken, refreshToken } = generateToken(user._id);
      const verify = verifyToken(accessToken);
      const userData = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url,
      };
      res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        verify,
        data: userData
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.refreshToken = () => {
  
}

//hàm đăng xuất
exports.signOut = async (req, res) => {
  try {
    res.json({ status: 'success', error: null });
  } catch (error) {
    res.json({ error: error.message });
  }
};

//hàm lấy thông tin người dùng
exports.getUsers = async (req, res) => {
  const users = await UserModel.find().select( '-password');
  if(!users){
    return res.json({
      status: 'failed',
    })
  }
  return res.status(201).json({
    status: 'success',
    users
  })
};

//hàm lấy thông tin người dùng chi tiết
exports.getUser = async (req, res) => {
  const user = await UserModel.findById(req.userAuth._id).select("-password");
  if(!user){
    new Error('User not found')
    return res.status(404).json({
      status: "Get profile failed",
      error
    })
  }
  return res.status(201).json({
    status: 'success',
    user
  })
};

//hàm cập nhật người dùng
exports.updateUser = async (req, res) => {
  const { name, avatar_url } = req.body;
  const updateUser = await UserModel.findByIdAndUpdate(req.userAuth._id, {
    name,
    avatar_url,
  },
  {
    new: true
  }).select("-password")
  if(!updateUser){
    return res.json({
      status: "update failed",
    })
  }
  return res.json({
    status: "update success", 
    updateUser, 
    });
};
exports.updatePassword = async (req, res) => {
  try {
    // Lấy thông tin từ body request
    const { username, currentPassword, newPassword } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({
        status: "failed",
        error: "Please provide all necessary information"
      });
    }

    // Tìm người dùng theo username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found"
      });
    }

    // Kiểm tra mật khẩu cũ có đúng không
    const isOldPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        status: "failed",
        error: "Old password is incorrect"
      });
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.password = hashedNewPassword;
    await user.save();

    return res.json({
      status: "success",
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      error: error.message
    });
  }
};
