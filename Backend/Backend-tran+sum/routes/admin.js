const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware"); // Đúng đường dẫn
const router = express.Router();

// API dành riêng cho Admin
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}, this is your dashboard!` });
});

module.exports = router;
