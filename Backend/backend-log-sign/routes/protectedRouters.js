const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Route chỉ cho user đăng nhập
router.get("/user-data", verifyToken, (req, res) => {
  res.json({ message: "Chỉ user đăng nhập mới thấy nội dung này.", user: req.user });
});

// Route chỉ cho admin
router.get("/admin-data", verifyAdmin, (req, res) => {
  res.json({ message: "Chỉ admin mới truy cập được!", user: req.user });
});

module.exports = router;
