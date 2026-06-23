const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone)
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    if (name.trim().length < 2)
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    if (!/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address: address || "",
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, profileImage: user.profileImage },
    });
  } catch (error) {
  console.error("Register error:", error);

  res.status(500).json({
    success: false,
    message: error.message
  });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminUser) {
        const hashedPass = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        adminUser = await User.create({ name: "Admin", email: process.env.ADMIN_EMAIL, password: hashedPass, phone: "0000000000", role: "admin" });
      }
      const token = generateToken(adminUser._id);
      return res.json({ success: true, message: "Admin login successful", token, user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: "admin" } });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (user.isBanned) return res.status(403).json({ success: false, message: "Your account has been banned. Contact admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, profileImage: user.profileImage },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone)
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    if (!/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ success: false, message: "Phone must be 10 digits" });

    const updateData = { name: name.trim(), phone, address: address || "" };
    if (req.file) updateData.profileImage = req.file.location;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };