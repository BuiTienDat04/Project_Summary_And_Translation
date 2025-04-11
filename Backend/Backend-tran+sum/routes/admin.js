const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require("../models/ContentHistory");
const router = express.Router();
const Visit = require("../models/Visit");

router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}, this is your dashboard!` });
});

router.get("/content-history/:limit?", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 100;
    const histories = await ContentHistory.find()
      .populate({
        path: "userId",
        model: "User",
        select: "email name",
      })
      .sort({ lastUpdated: -1 }) // Sắp xếp theo lastUpdated, mới nhất trước
      .limit(limit);

    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: "No history data found" });
    }

    const formatted = histories.map((h) => {
      if (!h.userId || !h.userId.email) {
        console.warn("Invalid user data for history:", h);
        return {
          userId: h.userId ? h.userId._id : "Unknown",
          email: h.userId ? h.userId.email : "Unknown",
          contents: h.contents,
          lastUpdated: h.lastUpdated,
        };
      }
      return {
        userId: h.userId._id,
        email: h.userId.email,
        contents: h.contents,
        lastUpdated: h.lastUpdated,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử nội dung:", err.message, err.stack);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu lịch sử", details: err.message });
  }
});

router.delete("/delete-content/:userId/:contentId", verifyToken, async (req, res) => {
  const { userId, contentId } = req.params;

  if (req.user._id.toString() !== userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this content" });
  }

  try {
    const userHistory = await ContentHistory.findOne({ userId });
    if (!userHistory) {
      return res.status(404).json({ message: "User history not found" });
    }

    userHistory.contents = userHistory.contents.filter(
      (content) => content._id.toString() !== contentId
    );

    await userHistory.save();

    // Kiểm tra xem có cần cập nhật Visit không
    await Visit.findOneAndUpdate(
      {},
      { $inc: { translatedPosts: 1 } },
      { upsert: true, new: true }
    );

    res.json({ message: "Content deleted successfully", userId, contentId });
  } catch (err) {
    console.error("Lỗi khi xóa nội dung:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;