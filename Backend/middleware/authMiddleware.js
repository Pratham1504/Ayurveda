const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(403).json({
        message: "Please Login",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData || !decodedData._id)
      return res.status(403).json({
        message: "Invalid token",
      });
    req.user = await User.findById(decodedData._id);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    res.status(500).json({
      message: "Login First",
    });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(403).json({
        message: "Please Login",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData || !decodedData._id){
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    req.user = await User.findById(decodedData._id);

    if (req.user.role !== "admin"){
      return res.status(403).json({
        message: "You are not authorized to access this resource",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Login First",
    });
  }
};
