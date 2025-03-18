const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // Lưu thời gian truy cập
  uploadedPosts: { type: Number, default: 0 }, // Số bài tải lên
  summarizedPosts: { type: Number, default: 0 }, // Số bài đã tóm tắt
  translatedPosts: { type: Number, default: 0 }, // Số bài đã dịch
  totalVisits: { type: Number, default: 0 } // 🔹 Thêm totalVisits vào schema
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
