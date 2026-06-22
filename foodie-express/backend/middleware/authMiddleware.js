const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      if (req.user.isBanned) {
        return res.status(403).json({ success: false, message: "Your account has been banned" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };
