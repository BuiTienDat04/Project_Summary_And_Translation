const mongoose = require("mongoose");

const contentHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, enum: ['summarize', 'translate', 'chat'], required: true },
    contentType: { type: String, enum: ['text', 'pdf', 'url'], required: true },
    originalContent: { type: String }, // Lưu 200 ký tự đầu cho text/pdf, url gốc cho link
    resultContent: { type: String, required: true },
    language: { type: String },
    fileInfo: { // Chỉ dành cho PDF
        name: String,
        size: Number
    },
    url: { type: String }, // Chỉ dành cho URL
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Giới hạn tối đa 50 nội dung mỗi tài khoản
contentHistorySchema.pre("save", function(next) {
    if (this.contents.length > 50) {
        this.contents = this.contents.slice(-50); // Giữ lại 50 nội dung mới nhất
    }
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model("ContentHistory", contentHistorySchema);