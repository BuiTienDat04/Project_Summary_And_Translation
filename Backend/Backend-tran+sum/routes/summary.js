const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// API Tóm tắt nội dung - Chỉ cho user đã đăng nhập
router.post("/summarize", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Vui lòng nhập văn bản cần tóm tắt." });
    }

    // Logic xử lý tóm tắt (giữ đơn giản, cắt 50 ký tự đầu)
    const summary = text.length > 50 ? text.slice(0, 50) + "..." : text;

    res.json({ message: "Tóm tắt thành công!", summary });
  } catch (error) {
    console.error("Lỗi tóm tắt:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
