const groqService = require("../services/groqService");

exports.generateQuote = async (req, res) => {
  try {
    const { category, tone, language, length } = req.body;
    
    if (!category || !tone || !language || !length) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters. category, tone, language, and length are required."
      });
    }

    const quote = await groqService.generateQuote(category, tone, language, length);
    return res.status(200).json({
      success: true,
      quote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
