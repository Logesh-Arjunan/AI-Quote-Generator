require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AI Quote Generator Server running on port ${PORT}`);
  console.log(`📡 Local Endpoint: http://localhost:${PORT}`);
  console.log(`🤖 Groq AI Connection: ${process.env.GROQ_API_KEY ? "Configured" : "⚠️ Demo/Mock Mode"}`);
});
