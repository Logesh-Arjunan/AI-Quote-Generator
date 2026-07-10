const mongoose = require('mongoose');
const Quote = require('../models/Quote');

// Initialize in-memory mock database for offline fallback
global.mockQuotesStorage = global.mockQuotesStorage || [
  {
    _id: 'mock1',
    text: 'Do not watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
    topic: 'Motivation',
    tone: 'Inspirational',
    length: 'short',
    generatedBy: '60c72b2f9b1d8b2bad98f98a',
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'mock2',
    text: 'Knowing yourself is the beginning of all wisdom.',
    author: 'Aristotle',
    topic: 'Wisdom',
    tone: 'Philosophical',
    length: 'medium',
    generatedBy: '60c72b2f9b1d8b2bad98f98a',
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'mock3',
    text: 'A clever person solves a problem. A wise person avoids it.',
    author: 'Albert Einstein',
    topic: 'Success',
    tone: 'Witty',
    length: 'medium',
    generatedBy: '60c72b2f9b1d8b2bad98f98a',
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

const checkDbOffline = () => {
  return mongoose.connection.readyState !== 1;
};

// @desc    Generate a new quote using Groq API
// @route   POST /api/quotes/generate
// @access  Private
const generateQuote = async (req, res) => {
  const { topic, tone, length } = req.body;
  const isOffline = checkDbOffline();

  try {
    const apiKey = process.env.GROQ_API_KEY;
    let finalQuoteText = '';
    let finalAuthor = '';

    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
      // Fallback in case API Key is missing
      const fallbacks = {
        motivation: {
          inspirational: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          philosophical: "The only true wisdom is in knowing you know nothing.",
          witty: "I find that the harder I work, the more luck I seem to have."
        },
        success: {
          inspirational: "Your time is limited, so don't waste it living someone else's life.",
          philosophical: "The definition of success is to live your life in your own way.",
          witty: "Success is simply a matter of luck. Ask any failure."
        }
      };

      finalQuoteText = (fallbacks[topic.toLowerCase()] && fallbacks[topic.toLowerCase()][tone.toLowerCase()]) 
        || `This is a generated placeholder quote about ${topic} in a ${tone} tone because no valid GROQ_API_KEY was supplied.`;
      finalAuthor = "System Fallback Manager";
    } else {
      // Build Llama 3.3 prompt
      const systemPrompt = `You are a professional and creative quote generator. Your task is to generate one high-quality, impactful quote based on the topic, tone, and length provided.
You must respond with a raw JSON object containing exactly two keys: "quote" and "author".
Do not wrap your response in markdown code blocks like \`\`\`json ... \`\`\`. Output only the JSON.

Example:
{"quote": "Be the change that you wish to see in the world.", "author": "Mahatma Gandhi"}
`;

      const userPrompt = `Topic: "${topic}"
Tone: "${tone}"
Length constraints: "${length}" (short = 1-12 words, medium = 13-25 words, long = 26+ words)
`;

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          response_format: { type: 'json_object' }
        })
      });

      if (!groqResponse.ok) {
        const errBody = await groqResponse.text();
        throw new Error(`Groq API Error: ${groqResponse.statusText} - ${errBody}`);
      }

      const data = await groqResponse.json();
      const content = data.choices[0].message.content.trim();
      
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseErr) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI JSON response');
        }
      }
      finalQuoteText = parsedContent.quote || parsedContent.text;
      finalAuthor = parsedContent.author || 'Anonymous';
    }

    // Save Logic (DB Offline vs Online)
    let newQuote;
    if (isOffline) {
      newQuote = {
        _id: 'mock_' + Math.random().toString(36).substring(2, 9),
        text: finalQuoteText,
        author: finalAuthor,
        topic,
        tone,
        length,
        generatedBy: req.user._id.toString(),
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };
      global.mockQuotesStorage.unshift(newQuote);
    } else {
      newQuote = await Quote.create({
        text: finalQuoteText,
        author: finalAuthor,
        topic,
        tone,
        length,
        generatedBy: req.user._id,
      });
    }

    res.status(201).json({
      success: true,
      data: newQuote
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quote. ' + error.message
    });
  }
};

// @desc    Get all user quotes (with filter & search)
// @route   GET /api/quotes
// @access  Private
const getQuotes = async (req, res) => {
  const isOffline = checkDbOffline();

  try {
    const { search, topic, tone, isFavorite } = req.query;

    if (isOffline) {
      let filtered = [...global.mockQuotesStorage];

      // Filter by user ID
      filtered = filtered.filter(q => q.generatedBy === req.user._id.toString());

      if (topic) {
        filtered = filtered.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
      }
      if (tone) {
        filtered = filtered.filter(q => q.tone.toLowerCase().includes(tone.toLowerCase()));
      }
      if (isFavorite === 'true') {
        filtered = filtered.filter(q => q.isFavorite === true);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          q => q.text.toLowerCase().includes(query) || q.author.toLowerCase().includes(query)
        );
      }

      // Sort by newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    }

    let query = { generatedBy: req.user._id };

    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (tone) {
      query.tone = { $regex: tone, $options: 'i' };
    }
    if (isFavorite === 'true') {
      query.isFavorite = true;
    }
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const quotes = await Quote.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quotes.length,
      data: quotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle quote favorite status
// @route   PATCH /api/quotes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  const isOffline = checkDbOffline();

  try {
    if (isOffline) {
      const quote = global.mockQuotesStorage.find(q => q._id === req.params.id);
      if (!quote) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }
      if (quote.generatedBy !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      quote.isFavorite = !quote.isFavorite;
      return res.json({
        success: true,
        data: quote
      });
    }

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    if (quote.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    quote.isFavorite = !quote.isFavorite;
    await quote.save();

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
// @access  Private
const deleteQuote = async (req, res) => {
  const isOffline = checkDbOffline();

  try {
    if (isOffline) {
      const quoteIdx = global.mockQuotesStorage.findIndex(q => q._id === req.params.id);
      if (quoteIdx === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }
      const quote = global.mockQuotesStorage[quoteIdx];
      if (quote.generatedBy !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      global.mockQuotesStorage.splice(quoteIdx, 1);
      return res.json({
        success: true,
        message: 'Quote removed'
      });
    }

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    if (quote.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await quote.deleteOne();

    res.json({
      success: true,
      message: 'Quote removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateQuote,
  getQuotes,
  toggleFavorite,
  deleteQuote
};
