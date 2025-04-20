const UserModel = require('../models/userModel');
const verifyToken = require('../services/verifyToken');

const isLogin = async (req, res, next) => {
    const headerObj = req.headers;
    const accessToken = headerObj.authorization.split(" ")[1];

    const verify = verifyToken(accessToken);
    if(!verify){
        const err = new Error('Token is invalid')
        next(err);
        return res.status().json({
            status: "Failed",
            error: "Token is invalid"
        })
    }
    const user = await UserModel.findById(verify.id).select('-password');
    console.log("USER:", user)
    req.userAuth = user
    next();
}

module.exports = isLogin