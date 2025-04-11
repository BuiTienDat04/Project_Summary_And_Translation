const mongoose = require("mongoose");

const contentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contents: [{
        type: {
            type: String,
            enum: ["text", "pdf", "link", "translate"],
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
        url: {
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

// Thêm index cho userId để tối ưu truy vấn
contentHistorySchema.index({ userId: 1 });

contentHistorySchema.pre("save", function(next) {
    if (this.contents.length > 50) {
        this.contents = this.contents.slice(-50);
    }
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model("ContentHistory", contentHistorySchema);