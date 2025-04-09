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
router.delete("/delete-chat/:userId/:chatId", verifyToken, async (req, res) => {
  const { userId, chatId } = req.params;
  console.log(">>> Delete chat for userId:", userId, "chatId:", chatId);

  try {
    console.log("Received DELETE request:", { userId, chatId });

    // Check if user is admin or owns the chat
    if (req.user._id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this chat" });
    }

    console.log("Finding chat history for userId:", userId);
    const chatHistory = await ChatHistory.findById(userId);
    if (!chatHistory) {
      console.log("Chat history not found");
      return res.status(404).json({ message: "Chat history not found" });
    }

    console.log("Messages before delete:", chatHistory.messages.length);
    const originalLength = chatHistory.messages.length;
    chatHistory.messages = chatHistory.messages.filter(
      (msg) => msg.chat_id && msg.chat_id.toString() !== chatId
    );

    if (chatHistory.messages.length === originalLength) {
      console.log("Message not found for chatId:", chatId);
      return res.status(404).json({ message: "Message not found" });
    }

    console.log("Saving updated chat history");
    await chatHistory.save();

    console.log("Chat message deleted successfully");
    return res.status(200).json({ message: "Chat message deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err.message, err.stack);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;