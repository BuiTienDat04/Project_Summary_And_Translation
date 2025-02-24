const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// API Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, dateOfBirth, role } = req.body;

    // Kiểm tra tài khoản đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Chỉ admin mới có thể tạo tài khoản admin
    let userRole = "user"; // Mặc định là user
    if (role && role === "admin") {
      return res.status(403).json({ message: "Only admin can create an admin account" });
    }

    // Tạo tài khoản mới
    const newUser = new User({ name, email, password: hashedPassword, phoneNumber, dateOfBirth, role: userRole });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name, email, role: userRole } });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API Đăng nhập
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Kiểm tra tài khoản
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      // Tạo token JWT
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

module.exports = router;
