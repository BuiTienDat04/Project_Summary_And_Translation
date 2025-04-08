const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    source: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

chatHistorySchema.pre("save", function(next) {
  if (this.messages.length > 20) {
    this.messages = this.messages.slice(-20);
  }
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
