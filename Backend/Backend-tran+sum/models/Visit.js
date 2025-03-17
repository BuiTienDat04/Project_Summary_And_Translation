const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // Lưu thời gian truy cập
  uploadedPosts: { type: Number, default: 0 }, // Số bài tải lên
  summarizedPosts: { type: Number, default: 0 }, // Số bài đã tóm tắt
  translatedPosts: { type: Number, default: 0 }, // Số bài đã dịch
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
