const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new user (Admin only)
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
    res.status(201).json({ message: "User created successfully!", user: newUser });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
