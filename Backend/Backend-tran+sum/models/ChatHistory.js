const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: String,  // Đổi từ ObjectId sang String để hỗ trợ cả guest ID
        required: true,
        index: true
    },
    isGuest: {
        type: Boolean,
        default: true,
        index: true
    },
    userRef: {  // Thêm tham chiếu đến User nếu là authenticated user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    messages: [{
        question: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        answer: {
            type: String,
            required: true,
            trim: true
        },
        source: {
            type: String,
            required: true,
            enum: ["text", "pdf", "link", "general"],  // Giới hạn các giá trị hợp lệ
            default: "general"
        },
        isGuest: {
            type: Boolean,
            default: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true  // Thêm index để tối ưu truy vấn theo thời gian
        }
    }],
    messageCount: {  // Thêm trường đếm để tối ưu hiệu năng
        type: Number,
        default: 0
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware để giới hạn tin nhắn và tự động cập nhật
chatHistorySchema.pre("save", function(next) {
    const MAX_MESSAGES = 50;  // Tăng giới hạn lên 50 tin nhắn
    
    if (this.messages.length > MAX_MESSAGES) {
        this.messages = this.messages.slice(-MAX_MESSAGES);
    }
    
    this.messageCount = this.messages.length;
    
    // Tự động gán userRef nếu không phải guest
    if (!this.isGuest && !this.userRef) {
        this.userRef = this.userId;
    }
    
    next();
});

// Index phức hợp để tối ưu truy vấn
chatHistorySchema.index({ userId: 1, isGuest: 1 });
chatHistorySchema.index({ "messages.timestamp": -1 });

// Virtual populate nếu cần liên kết với User
chatHistorySchema.virtual("user", {
    ref: "User",
    localField: "userRef",
    foreignField: "_id",
    justOne: true
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);