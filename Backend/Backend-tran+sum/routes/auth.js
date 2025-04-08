const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Visit = require("../models/Visit");
const { parsePhoneNumberFromString } = require("libphonenumber-js");  
const router = express.Router();

// Regular Expressions for Validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Only @gmail.com emails
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Min 8 chars, 1 uppercase, 1 lowercase, 1 special char, 1 number

const DEFAULT_COUNTRY_CODE = "VN"; // Default country (Vietnam)

module.exports = (visitCountObj) => {
  const { visitCount } = visitCountObj;

  // ================== 🟢 REGISTER API ==================
  router.post("/register", async (req, res) => {
    try {
      let { name, email, password, phoneNumber, dateOfBirth, role } = req.body;
  
      // Validate email format
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email format. Only Gmail accounts are allowed (example@gmail.com)."
        });
      }
  
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // Validate password strength
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }
  
      // Validate and format phone number
      let parsedPhone = parsePhoneNumberFromString(phoneNumber, DEFAULT_COUNTRY_CODE);
      if (!parsedPhone || !parsedPhone.isValid()) {
        return res.status(400).json({ message: "Invalid phone number format. Please enter a valid number." });
      }
      phoneNumber = parsedPhone.formatInternational();
  
      // Check if phone number already exists
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
  
      // Validate age (must be at least 13)
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const isOldEnough = age > MINIMUM_AGE || (age === MINIMUM_AGE && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  
      if (!isOldEnough) {
        return res.status(400).json({ message: "You must be at least 13 years old to register." });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Set role to "user" if not provided
      const userRole = role || "user";
  
      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        dateOfBirth,
        role: userRole
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name,
          email,
          phoneNumber,
          role: userRole
        }
      });
  
    } catch (error) {
      console.error("❌ Error in /register:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // ================== 🟢 LOGIN API ==================
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      await Visit.findOneAndUpdate({}, { $inc: { totalVisits: 1 } }, { upsert: true, new: true });

      console.log(`✅ User ${user._id} logged in successfully`);
      res.status(200).json({
        message: "Login successful",
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error("❌ Login error:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  // ================== 🟢 LOGOUT API ==================
  router.post("/logout", async (req, res) => {
    try {
      console.log("🔹 /logout API called at:", new Date().toISOString());
      console.log("🔹 Cookies received:", req.cookies);

      // Xóa cookie
      res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      console.log("🔹 Cookie 'token' cleared");

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("❌ Error in /logout:", error.stack);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  return router;
};