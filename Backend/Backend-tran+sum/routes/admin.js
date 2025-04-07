const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware"); // Đúng đường dẫn
const router = express.Router();

// API dành riêng cho Admin
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}, this is your dashboard!` });
});

// GET: Lấy toàn bộ lịch sử tóm tắt của người dùng
router.get("/content-history", async (req, res) => {
  try {
      const histories = await ContentHistory.find().populate("_id", "email"); // Hiển thị cả email người dùng
      res.json(histories);
  } catch (err) {
      res.status(500).json({ error: "Lỗi khi lấy dữ liệu lịch sử" });
  }
});
module.exports = router;
