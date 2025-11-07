const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.userId = user._id; // use this in profile routes
    req.user = user;       // optional: attach full user object
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

module.exports = auth;
