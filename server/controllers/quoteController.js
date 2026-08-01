const Quote = require("../models/Quote");
const User = require("../models/User");
const groqService = require("../services/groqService");

// POST /api/quote/generate
const generateQuote = async (req, res) => {
  try {
    const { category, mood, language, length } = req.body;
    if (!category || !mood || !language || !length) {
      return res.status(400).json({ success: false, message: "category, mood, language, and length are required." });
    }

    const quoteText = await groqService.generateQuote(category, mood, language, length);
    if (!quoteText) return res.status(500).json({ success: false, message: "Failed to generate quote." });

    const quote = await Quote.create({ userId: req.user._id, category, mood, language, quote: quoteText });

    // Update user stats
    const user = await User.findById(req.user._id);
    const catCounts = {};
    const moodCounts = {};
    const allQuotes = await Quote.find({ userId: req.user._id }, "category mood");
    allQuotes.forEach(q => {
      catCounts[q.category] = (catCounts[q.category] || 0) + 1;
      moodCounts[q.mood] = (moodCounts[q.mood] || 0) + 1;
    });
    const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Motivation";
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Happy";
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.totalQuotes": 1 },
      "stats.favoriteCategory": topCat,
      "stats.favoriteMood": topMood
    });

    return res.status(201).json({ success: true, quote });
  } catch (err) {
    console.error("generateQuote error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/quote/:id/explain
const explainQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) return res.status(404).json({ success: false, message: "Quote not found." });

    const explanation = await groqService.explainQuote(quote.quote, quote.category, quote.mood, quote.language);
    quote.explanation = explanation;
    await quote.save();

    return res.status(200).json({ success: true, explanation, quote });
  } catch (err) {
    console.error("explainQuote error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/quote/history
const getHistory = async (req, res) => {
  try {
    const { search, category, mood, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (mood) filter.mood = mood;
    if (search) filter.quote = { $regex: search, $options: "i" };

    const total = await Quote.countDocuments(filter);
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, quotes, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/quote/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) return res.status(404).json({ success: false, message: "Quote not found." });
    quote.favorite = !quote.favorite;
    await quote.save();
    return res.status(200).json({ success: true, favorite: quote.favorite, quote });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/quote/:id
const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) return res.status(404).json({ success: false, message: "Quote not found." });
    await Quote.findByIdAndDelete(quote._id);
    await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.totalQuotes": -1 } });
    return res.status(200).json({ success: true, message: "Quote deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateQuote, explainQuote, getHistory, toggleFavorite, deleteQuote };