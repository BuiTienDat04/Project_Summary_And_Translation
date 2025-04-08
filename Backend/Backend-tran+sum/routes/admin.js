const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require("../models/ContentHistory"); // Đảm bảo import đúng
const User = require("../models/User"); // Import để dùng populate
const router = express.Router();

// API dành riêng cho Admin
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}, this is your dashboard!` });
});

// GET: Lấy toàn bộ lịch sử tóm tắt của người dùng (cho giao diện Admin)
router.get("/content-history", verifyAdmin, async (req, res) => {
  try {
    const histories = await ContentHistory.find()
      .populate({
        path: "_id",
        model: "User",
        select: "email name", // Có thể chọn thêm "name" nếu cần
      });

    // Chuyển đổi dữ liệu trả về cho dễ dùng ở FE
    const formatted = histories.map((h) => ({
      userId: h._id._id,           // ID thực của User
      email: h._id.email,
      contents: h.contents,
      lastUpdated: h.lastUpdated,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử nội dung:", err);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu lịch sử" });
  }
});

module.exports = router;
