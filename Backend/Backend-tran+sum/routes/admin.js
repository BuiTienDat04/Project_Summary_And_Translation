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
router.delete("/:userId/message/:chatId", async (req, res) => {
  const { userId, chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid userId or chatId" });
  }

  try {
    const chatHistory = await ChatHistory.findById(userId);
    if (!chatHistory) {
      return res.status(404).json({ error: "Chat history not found" });
    }

    const originalLength = chatHistory.messages.length;

    // Lọc ra các message không có chat_id bằng chatId
    chatHistory.messages = chatHistory.messages.filter(
      (msg) => msg.chat_id.toString() !== chatId
    );

    if (chatHistory.messages.length === originalLength) {
      return res.status(404).json({ error: "Message not found" });
    }

    chatHistory.lastUpdated = Date.now();
    await chatHistory.save();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
