const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require('../models/ContentHistory');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


/** 
 * ✅ API: Lấy danh sách user
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => { 
  try {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    const users = await User.find().select("-password").lean();
    console.log("Users found:", users);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/** 
 * ✅ API: Lấy thông tin user theo ID
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/** 
 * ✅ API: Admin tạo user mới
 */
router.post("/create", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, phoneNumber, dateOfBirth, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      dateOfBirth,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/** 
 * ✅ API: Cập nhật thông tin user
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, email, phoneNumber, dateOfBirth, role, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Chỉ admin hoặc chính chủ user mới được sửa
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Cập nhật thông tin user
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (req.user.role === "admin") {
      user.role = role || user.role;
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/** 
 * ✅ API: Xóa user (Admin Only)
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Lấy lịch sử nội dung của người dùng
router.get('/history', verifyToken, async (req, res) => {
  try {
      const userId = req.user.id; 
      const history = await ContentHistory.findOne({ userId }).populate('userId', 'username email');
      
      if (!history) {
          return res.status(404).json({ message: 'No history found' });
      }

      res.status(200).json(history);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error!' });
  }
});

module.exports = router;