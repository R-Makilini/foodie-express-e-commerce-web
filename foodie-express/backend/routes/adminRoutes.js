const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllUsers, toggleBanUser } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);

module.exports = router;
