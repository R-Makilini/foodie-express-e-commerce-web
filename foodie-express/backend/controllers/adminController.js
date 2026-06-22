const User = require("../models/User");
const Product = require("../models/Product");
const Request = require("../models/Request");

// @desc   Get dashboard statistics
// @route  GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalRequests = await Request.countDocuments();
    const acceptedRequests = await Request.countDocuments({ status: "accepted" });
    const rejectedRequests = await Request.countDocuments({ status: "rejected" });
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const bannedUsers = await User.countDocuments({ role: "user", isBanned: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalRequests,
        acceptedRequests,
        rejectedRequests,
        pendingRequests,
        bannedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// @desc   Ban / Unban user
// @route  PUT /api/admin/users/:id/ban
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot ban admin" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleBanUser };
