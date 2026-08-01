const express = require("express");
const router = express.Router();
const { createChat, getChats, getChatMessages, sendMessage, deleteChat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createChat);
router.get("/", protect, getChats);
router.get("/:id", protect, getChatMessages);
router.post("/:id/message", protect, sendMessage);
router.delete("/:id", protect, deleteChat);

module.exports = router;
