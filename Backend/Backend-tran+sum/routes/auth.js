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

      // Validate Email Format
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format. Only Gmail accounts are allowed (example@gmail.com)." });
      }

      // Check if Email Already Exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });

      // Validate Password
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }

      // Validate & Format Phone Number
      let parsedPhone = parsePhoneNumberFromString(phoneNumber, DEFAULT_COUNTRY_CODE);
      if (!parsedPhone || !parsedPhone.isValid()) {
        return res.status(400).json({ message: "Invalid phone number format. Please enter a valid number." });
      }
      phoneNumber = parsedPhone.formatInternational(); // Convert to international format

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set Role (default to "user" if not provided)
      const userRole = role || "user";

      // Create New User
      const newUser = new User({ name, email, password: hashedPassword, phoneNumber, dateOfBirth, role: userRole });
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser._id, name, email, phoneNumber, role: userRole }
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

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

      // Kiểm tra kết nối DB
      let visitData = await Visit.findOne();
      console.log("🔹 Visit data found:", visitData);
      if (!visitData) {
        visitData = await Visit.create({ totalVisits: 0 });
        console.log("🔹 Created new visit data:", visitData);
      }

      // Cập nhật totalVisits với logic an toàn
      const updatedVisit = await Visit.findOneAndUpdate(
        {},
        { $inc: { totalVisits: -1 } },
        { new: true }
      );
      if (updatedVisit.totalVisits < 0) {
        updatedVisit.totalVisits = 0;
        await updatedVisit.save();
      }
      console.log("🔹 Total visits after update:", updatedVisit.totalVisits);

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
      console.error("❌ Error in /logout:", error.stack); // Log chi tiết lỗi
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  return router; // 🟢 Trả về router
};