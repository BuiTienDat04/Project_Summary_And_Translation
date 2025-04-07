const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [{
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
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

// Giới hạn tối đa 20 tin nhắn mỗi tài khoản
chatHistorySchema.pre("save", function(next) {
    if (this.messages.length > 20) {
        this.messages = this.messages.slice(-20); // Giữ lại 20 tin nhắn mới nhất
    }
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);