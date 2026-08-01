const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  category: { type: String, required: true },
  mood: { type: String, required: true },
  language: { type: String, required: true },
  quote: { type: String, required: true },
  explanation: {
    meaning: { type: String, default: "" },
    lifeLesson: { type: String, default: "" },
    practicalExample: { type: String, default: "" }
  },
  favorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Quote", QuoteSchema);
