const Groq = require("groq-sdk");

const isApiKeyConfigured = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key_here";

let groq = null;
if (isApiKeyConfigured) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn("⚠️ GROQ_API_KEY is not configured. Running in Demo/Mock Mode with seeded fallback quotes.");
}

const fallbackQuotes = {
  Motivation: "The only limit to our realization of tomorrow is our doubts of today. [Demo Mode]",
  Inspirational: "Act as if what you do makes a difference. It does. [Demo Mode]",
  Wisdom: "In the middle of every difficulty lies opportunity. [Demo Mode]",
  Success: "Success is not final, failure is not fatal: it is the courage to continue that counts. [Demo Mode]"
};

/**
 * Generates an original quote using Groq Llama-3.3-70b-versatile.
 */
const generateQuote = async (category, tone, language, length) => {
  if (!isApiKeyConfigured) {
    // Artificial delay to simulate network call
    await new Promise(resolve => setTimeout(resolve, 800));
    return fallbackQuotes[category] || fallbackQuotes.Motivation;
  }

  try {
    const prompt = `Generate one original inspirational quote.
    
    Category: ${category}
    Tone: ${tone}
    Language: ${language}
    Length: ${length} (Short = 1-2 sentences, Medium = 2-3 sentences, Long = 4+ sentences)
    
    Rules:
    - Return ONLY the quote text.
    - Do not include quotation marks, numbering, or explanations.
    - Ensure it is written entirely in ${language}.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a professional quote generation assistant. You only output the quote itself." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 256
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq API error:", error.message);
    throw new Error("Groq API Error");
  }
};

module.exports = { generateQuote };
