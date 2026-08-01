const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: "Too many requests. Please try again later." }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Please try again later." }
});

app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Unauthenticated routes (work without MongoDB) ────────────────
const geminiService = require("./services/geminiService");

// Direct quote generation — no auth or DB needed
app.post("/api/quote/generate", async (req, res) => {
  try {
    const { category, mood, language, length } = req.body;
    if (!category || !language || !length) {
      return res.status(400).json({ success: false, message: "category, language, and length are required." });
    }
    const quoteText = await geminiService.generateQuote(category, language, length);
    if (!quoteText) return res.status(500).json({ success: false, message: "Failed to generate quote." });
    return res.status(201).json({ success: true, quote: quoteText });
  } catch (err) {
    console.error("Quote generation error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Direct chat — no auth or DB needed
app.post("/api/chat/message", async (req, res) => {
  try {
    const { history } = req.body;
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ success: false, message: "Conversation history is required." });
    }
    // Map frontend format { role, text } to Gemini format
    const messages = history.map(m => ({
      role: m.role === "model" ? "model" : m.role,
      text: m.text || m.content
    }));
    const aiResponse = await geminiService.generateChatResponse(messages);
    return res.status(200).json({ success: true, response: aiResponse });
  } catch (err) {
    console.error("Chat error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── Authenticated routes (require MongoDB) ───────────────────────
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/quote", require("./routes/quoteRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "AI Quote Assistant API is running." }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error." });
});

module.exports = app;