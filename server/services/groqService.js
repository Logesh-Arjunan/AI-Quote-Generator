const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `You are QuoteGPT, a friendly and wise AI assistant.

Your responsibilities:
- Generate unique, original, inspiring quotes on any topic
- Explain quotes with deep insight (meaning, life lesson, practical example)
- Encourage and motivate users warmly
- Answer general questions politely and concisely
- Remember previous messages in the conversation to provide personalized responses
- Recommend quotes based on the user's mood and recent context

Rules:
- Never copy existing famous quotes — always create original ones
- Keep responses concise unless the user asks for detail
- Always maintain a positive, encouraging tone
- If the user shares personal context (exams, stress, goals), reference it in future responses`;

let groqClient = null;

function getClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured in environment variables.");
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

/**
 * Send a chat with full conversation history for context memory.
 * @param {Array} messages - array of { role: "user"|"assistant", content: string }
 * @returns {string} AI response text
 */
async function chat(messages) {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.8,
    max_tokens: 1024
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

/**
 * Generate an original quote for a given category, mood, language and length.
 * @returns {string} The quote text only
 */
async function generateQuote(category, mood, language, length) {
  const client = getClient();
  const lengthGuide = { Short: "1-2 sentences (under 20 words)", Medium: "2-3 sentences (20-50 words)", Long: "4-6 sentences (50-100 words)" };
  const prompt = `Generate one completely original inspirational quote.

Category: ${category}
Mood: ${mood}
Language: ${language}
Length: ${lengthGuide[length] || "1-2 sentences"}

Rules:
- Return ONLY the quote text, nothing else
- Do NOT include quotation marks, numbering, or explanations
- Do NOT copy existing famous quotes — create a unique one
- If language is Tamil, write entirely in Tamil script
- If language is Hindi, write entirely in Devanagari script
- If language is Spanish, French, or German write entirely in that language`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 256
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

/**
 * Explain a quote with meaning, life lesson, and practical example.
 * @returns {{ meaning, lifeLesson, practicalExample }}
 */
async function explainQuote(quote, category, mood, language) {
  const client = getClient();
  const prompt = `Explain this quote in a structured way:

"${quote}"

Category: ${category}
Mood: ${mood}

Return ONLY valid JSON (no markdown, no code fences) with these exact keys:
{
  "meaning": "A clear 1-2 sentence explanation of what this quote means",
  "lifeLesson": "The key life lesson someone can learn from this quote (1-2 sentences)",
  "practicalExample": "A real-world practical example of how to apply this wisdom (2-3 sentences)"
}`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 512
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "{}";
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { meaning: raw, lifeLesson: "", practicalExample: "" };
  }
}

module.exports = { chat, generateQuote, explainQuote };
