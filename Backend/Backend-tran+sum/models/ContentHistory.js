const mongoose = require("mongoose");

const contentHistorySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contents: [{
        type: {
            type: String,
            enum: ["text", "pdf", "link"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            default: null,
        },
        url: {  // Chỉ dùng cho link
            type: String,
            default: null,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
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