const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/** 
 * ✅ Create a new user (Admin only)
 */
router.post("/create", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, phoneNumber, dateOfBirth, role } = req.body;

    // 🔍 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // 🔑 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🎯 Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      dateOfBirth,
      role: role || "user", // Default role is "user"
    });

    await newUser.save();

    // 🛑 Remove password before sending response
    const userResponse = { ...newUser._doc };
    delete userResponse.password;

    res.status(201).json({ message: "User created successfully!", user: userResponse });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/** 
 * ✅ Get all users (Require login, Hide password)
 */
router.get("/", verifyToken, async (req, res) => { 
  try {
    const users = await User.find().select("-password"); // Ẩn mật khẩu
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 
 * ✅ Get user by ID
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 
 * ✅ Update user (Admin or User themselves)
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, email, phoneNumber, dateOfBirth, role, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra quyền admin hoặc chính user đó
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Cập nhật thông tin
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    
    // Chỉ admin có thể sửa role
    if (req.user.role === "admin") {
      user.role = role || user.role;
    }

    // Nếu có mật khẩu mới, hash và cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 
 * ✅ Delete user (Admin only)
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
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
