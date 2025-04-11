const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require("../models/ContentHistory");
const router = express.Router();
const Visit = require("../models/Visit");

router.get("/dashboard", verifyAdmin, (req, res) => {
  const userName = req.user && req.user.name ? req.user.name : "Admin";
  res.json({ message: `Welcome ${userName}, this is your dashboard!` });
});

router.get("/content-history/:limit?", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 100;
    // Chỉ lấy các bản ghi trong 30 ngày gần nhất để tối ưu hiệu suất
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const histories = await ContentHistory.find({ lastUpdated: { $gte: thirtyDaysAgo } })
      .populate({
        path: "userId",
        model: "User",
        select: "email name",
      })
      .sort({ lastUpdated: -1 })
      .limit(limit);

    if (histories.length === 0) {
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
    const userHistory = await ContentHistory.findOneAndUpdate(
      { userId },
      { $pull: { contents: { _id: contentId } } },
      { new: true }
    );

    if (!userHistory) {
      return res.status(404).json({ message: "User history not found" });
    }

    // Bỏ đoạn mã cập nhật Visit nếu không cần thiết
    // Nếu cần, sửa logic để giảm translatedPosts (nếu nội dung bị xóa là bài dịch)
    /*
    await Visit.findOneAndUpdate(
      {},
      { $inc: { translatedPosts: -1 } },
      { upsert: true, new: true }
    );
    */

    res.json({ message: "Content deleted successfully", userId, contentId });
  } catch (err) {
    console.error("Lỗi khi xóa nội dung:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;