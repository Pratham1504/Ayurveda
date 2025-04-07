const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
module.exports.verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", ""); // Bearer <token>

  if (!token || token == null)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // add user to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

