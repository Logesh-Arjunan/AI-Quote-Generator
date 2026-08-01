const express = require("express");
const router = express.Router();
const { generateQuote, explainQuote, getHistory, toggleFavorite, deleteQuote } = require("../controllers/quoteController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateQuote);
router.post("/:id/explain", protect, explainQuote);
router.get("/history", protect, getHistory);
router.post("/:id/favorite", protect, toggleFavorite);
router.delete("/:id", protect, deleteQuote);

module.exports = router;
