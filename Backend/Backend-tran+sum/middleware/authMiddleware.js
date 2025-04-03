const jwt = require("jsonwebtoken");
const User = require('../models/User');

// ✅ Middleware to verify user token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header:", authHeader); // Debug: Kiểm tra token nhận được

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const token = authHeader.split(" ")[1]; // Lấy token sau chữ "Bearer"

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Lưu thông tin user vào request
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token. Please log in again." });
  }
};

// ✅ Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
