require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 AI Quote Assistant Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🤖 Groq AI: ${process.env.GROQ_API_KEY ? "Connected" : "⚠️  GROQ_API_KEY missing!"}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai_quote_assistant"}`);
  });
};

start().catch(err => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});