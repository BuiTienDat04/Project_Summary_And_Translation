const mongoose = require('mongoose');

// 1. Mô hình MongoDB (Schema)
const contentHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalContent: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: false
  },
  translated: {
    type: String,
    required: false
  },
  originalLanguage: {
    type: String,
    required: true
  },
  translatedLanguage: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ContentHistory = mongoose.model('ContentHistory', contentHistorySchema);

// 2. Hàm lưu lịch sử
const saveContentHistory = async ({
  userId,
  originalContent,
  summary,
  translated,
  originalLanguage,
  translatedLanguage
}) => {
  const history = new ContentHistory({
    userId,
    originalContent,
    summary,
    translated,
    originalLanguage,
    translatedLanguage
  });

  return await history.save();
};

// 3. Hàm lấy lịch sử theo user
const getUserHistory = async (userId, limit = 20) => {
  return await ContentHistory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// 4. Xuất các hàm cần dùng
module.exports = {
  ContentHistory,
  saveContentHistory,
  getUserHistory
};
