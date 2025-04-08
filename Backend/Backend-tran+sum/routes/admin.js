const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User"); 
const router = express.Router();

// API dành riêng cho Admin
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}, this is your dashboard!` });
});

// GET: Lấy toàn bộ lịch sử tóm tắt của người dùng (cho giao diện Admin)
router.get("/content-history", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const histories = await ContentHistory.find()
      .populate({
        path: "_id",
        model: "User",
        select: "email name", 
      });

    const formatted = histories.map((h) => ({
      userId: h._id._id,        
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

// DELETE /admin/delete-content/:userId/:contentId
router.delete("/delete-content/:userId/:contentId", verifyAdmin, async (req, res) => {
  const { userId, contentId } = req.params;

  try {
    const userHistory = await ContentHistory.findOne({ userId });

    if (!userHistory) return res.status(404).json({ message: "User history not found" });

    // Lọc bỏ contentId cần xóa
    userHistory.contents = userHistory.contents.filter(content => content._id.toString() !== contentId);

    await userHistory.save();

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
