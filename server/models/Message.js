const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
