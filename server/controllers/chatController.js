const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const groqService = require("../services/groqService");

// POST /api/chat/create
const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.create({ userId: req.user._id, title: title || "New Conversation" });
    await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.totalChats": 1 } });
    return res.status(201).json({ success: true, chat });
  } catch (err) {
    console.error("createChat error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 }).limit(50);
    return res.status(200).json({ success: true, chats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat/:id
const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });
    const messages = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, chat, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/chat/:id/message
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: "Message content is required." });

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

    // Save user message
    await Message.create({ chatId: chat._id, role: "user", content: content.trim() });

    // Load last 10 messages for context memory
    const recentMessages = await Message.find({ chatId: chat._id }).sort({ createdAt: -1 }).limit(10);
    const historyForGroq = recentMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    // Update chat title from first user message
    if (chat.title === "New Conversation") {
      const shortTitle = content.trim().slice(0, 50);
      await Chat.findByIdAndUpdate(chat._id, { title: shortTitle });
    }

    const startTime = Date.now();
    const aiResponse = await groqService.chat(historyForGroq);
    const responseTime = Date.now() - startTime;

    // Save AI message
    const aiMessage = await Message.create({ chatId: chat._id, role: "assistant", content: aiResponse });

    // Update chat timestamp & user avg response time
    await Chat.findByIdAndUpdate(chat._id, { updatedAt: new Date() });
    const user = await User.findById(req.user._id);
    const currentAvg = user.stats.avgResponseTime || 0;
    const totalChats = user.stats.totalChats || 1;
    const newAvg = Math.round((currentAvg * (totalChats - 1) + responseTime) / totalChats);

    // Track longest chat
    const msgCount = await Message.countDocuments({ chatId: chat._id });
    const isLongest = msgCount > (user.stats.longestChat || 0);
    await User.findByIdAndUpdate(req.user._id, {
      "stats.avgResponseTime": newAvg,
      ...(isLongest && { "stats.longestChat": msgCount })
    });

    return res.status(200).json({ success: true, message: aiMessage });
  } catch (err) {
    console.error("sendMessage error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/chat/:id
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });
    await Message.deleteMany({ chatId: chat._id });
    await Chat.findByIdAndDelete(chat._id);
    return res.status(200).json({ success: true, message: "Chat deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createChat, getChats, getChatMessages, sendMessage, deleteChat };
