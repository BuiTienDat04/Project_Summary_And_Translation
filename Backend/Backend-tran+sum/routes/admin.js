const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User"); 
const ChatHistory = require("../models/ChatHistory");
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

router.delete("/delete-content/:userId/:contentId", verifyToken, async (req, res) => {
  const { userId, contentId } = req.params;

  if (req.user._id !== userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this content" });
  }

  try {
    const userHistory = await ContentHistory.findById(userId); // _id là userId
    if (!userHistory) return res.status(404).json({ message: "User history not found" });

    const index = userHistory.contents.findIndex(c => c._id.toString() === contentId);
    if (index === -1) return res.status(404).json({ message: "Content not found" });

    userHistory.contents.splice(index, 1);
    await userHistory.save();

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error("Delete content error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// GET: Get all chat history of users (for Admin view)
router.get("/chat-history", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const histories = await ChatHistory.find()
      .populate({
        path: "_id",
        model: "User",
        select: "email name", // Include email and name of user
      })
      .sort({ lastUpdated: -1 }); // Sort by most recently updated

    const formatted = histories.map((h) => ({
      userId: h._id._id,               // Get original user ID
      email: h._id.email,
      messages: h.messages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),                               // Sort messages by timestamp DESC
      lastUpdated: h.lastUpdated,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history data" });
  }
});

// DELETE: Delete a specific message in ChatHistory
router.delete("/delete-chat/:chatId/:messageId", verifyToken, async (req, res) => {
  const { chatId, messageId } = req.params;

  try {
    const chatHistory = await ChatHistory.findById(chatId); // _id là chatId
    if (!chatHistory) return res.status(404).json({ message: "Chat history not found" });

    const index = chatHistory.messages.findIndex(m => m._id.toString() === messageId);
    if (index === -1) return res.status(404).json({ message: "Message not found" });

    chatHistory.messages.splice(index, 1);
    await chatHistory.save();

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete chat message error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;
