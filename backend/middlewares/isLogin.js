const UserModel = require('../models/userModel');
const verifyToken = require('../services/verifyToken');

const isLogin = async (req, res, next) => {
    try {
        const headerObj = req.headers;
        
        // Kiểm tra xem có authorization header không
        if (!headerObj.authorization) {
            return res.status(401).json({
                status: "Failed",
                error: "No authorization header provided"
            });
        }

        const accessToken = headerObj.authorization.split(" ")[1];
        
        // Kiểm tra xem có token không
        if (!accessToken) {
            return res.status(401).json({
                status: "Failed",
                error: "No token provided"
            });
        }

        const verify = verifyToken(accessToken);
        if (!verify) {
            return res.status(401).json({
                status: "Failed",
                error: "Token is invalid"
            });
        }

        const user = await UserModel.findById(verify.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                status: "Failed",
                error: "User not found"
            });
        }

        console.log("USER:", user.name);
        req.userAuth = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            status: "Failed",
            error: "Authentication failed"
        });
    }
}

module.exports = isLogin