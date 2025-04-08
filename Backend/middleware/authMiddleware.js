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

    req.user = await User.findById(decodedData._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: "Login First",
    });
  }
};

