const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai_quote_assistant");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Failed: ${error.message}`);
    console.warn(`⚠️  The server will run without database features (auth, history, dashboard).`);
    console.warn(`⚠️  Quote generation and chat will still work.`);
    // Don't exit — allow the server to run without DB
  }
};

module.exports = connectDB;
