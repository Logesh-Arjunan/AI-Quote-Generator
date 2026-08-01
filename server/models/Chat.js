const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, default: "New Conversation" }
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
