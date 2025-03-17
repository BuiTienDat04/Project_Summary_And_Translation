const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Model User
const Translation = require("../models/Translation"); // Model bài dịch
const Visit = require("../models/Visit"); // Model lượt truy cập

// API lấy dữ liệu dashboard
// API lấy dữ liệu dashboard
router.get("/", async (req, res) => {
    try {
        // Đếm số lượng người dùng
        const totalUsers = await User.countDocuments();

        // Đếm số lượng bài dịch (nếu có model riêng)
        const translatedPostsFromDB = await Visit.findOne({}, "translatedPosts");

        // Lấy tổng số bài dịch từ Visit (nếu không có thì mặc định là 0)
        const translatedPosts = translatedPostsFromDB ? translatedPostsFromDB.translatedPosts : 0;

        // Đếm tổng số lượt truy cập
        const totalVisits = await Visit.countDocuments();

        // Gọi API dịch để kiểm tra hệ thống
        const response = await fetch("http://localhost:5001/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "Hello World", targetLang: "vi" }),
        });

        const translationResult = await response.json();
        const translatedText = translationResult.translation || "No translation available";

        // Trả về dữ liệu cho frontend
        res.status(200).json({
            totalUsers,
            translatedPosts, // ✅ Lấy từ MongoDB
            totalVisits,
            translatedText, // Kết quả dịch
        });
    } catch (error) {
        console.error("❌ Dashboard API Error:", error.message);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


module.exports = router;
