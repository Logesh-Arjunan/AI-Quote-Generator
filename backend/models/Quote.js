const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Quote text is required'],
      trim: true,
    },
    author: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    tone: {
      type: String,
      required: [true, 'Tone is required'],
      trim: true,
    },
    length: {
      type: String,
      enum: ['short', 'medium', 'long'],
      required: [true, 'Length is required'],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quote', quoteSchema);
