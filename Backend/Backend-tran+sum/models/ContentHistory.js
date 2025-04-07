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
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware để giới hạn số lượng bản ghi
contentHistorySchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Đếm số lượng bản ghi hiện có của user
            const count = await mongoose.model('ContentHistory').countDocuments({ userId: this.userId });
            
            // Nếu vượt quá 50 bản ghi, xóa bản ghi cũ nhất
            if (count >= 50) {
                const oldestRecords = await mongoose.model('ContentHistory')
                    .find({ userId: this.userId })
                    .sort({ createdAt: 1 }) // Sắp xếp theo thời gian tạo (cũ nhất đầu tiên)
                    .limit(count - 50 + 1); // Số lượng cần xóa
                
                // Xóa các bản ghi cũ nhất
                await mongoose.model('ContentHistory').deleteMany({
                    _id: { $in: oldestRecords.map(r => r._id) }
                });
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model("ContentHistory", contentHistorySchema);