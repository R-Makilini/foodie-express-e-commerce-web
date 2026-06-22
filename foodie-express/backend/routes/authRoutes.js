const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { uploadProfile } = require("../config/s3");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadProfile.single("profileImage"), updateProfile);

module.exports = router;