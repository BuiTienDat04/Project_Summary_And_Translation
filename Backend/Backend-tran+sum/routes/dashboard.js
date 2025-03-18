const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Model User
const Visit = require("../models/Visit"); // Model lượt truy cập

// API lấy dữ liệu dashboard
router.get("/", async (req, res) => {
    try {
        // 🔹 Đếm số lượng người dùng trong hệ thống
        const totalUsers = await User.countDocuments();

        // 🔹 Lấy dữ liệu từ Visit (nếu không có thì mặc định là 0)
        const visitData = await Visit.findOne();
        if (!visitData) {
            console.warn("⚠️ Warning: No visit data found in MongoDB.");
        }

        res.status(200).json({
            totalUsers,
            translatedPosts: visitData?.translatedPosts || 0,
            totalVisits: visitData?.totalVisits || 0
        });
    } catch (error) {
        console.error("❌ Dashboard API Error:", error.message);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;
