const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Quote = require("../models/Quote");

// GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Today's quote (most recent)
    const todayQuote = await Quote.findOne({ userId }).sort({ createdAt: -1 });

    // Favorites
    const favorites = await Quote.find({ userId, favorite: true }).sort({ createdAt: -1 }).limit(6);

    // Recent chats
    const recentChats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(5);

    // Usage data — last 7 days (quotes per day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyQuotes = await Quote.aggregate([
      { $match: { userId, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Build 7-day array
    const usageData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayData = dailyQuotes.find(q => q._id === dateStr);
      usageData.push({ date: dateStr, count: dayData ? dayData.count : 0 });
    }

    // Category breakdown
    const categoryBreakdown = await Quote.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, lastLogin: user.lastLogin, stats: user.stats, createdAt: user.createdAt },
      todayQuote: todayQuote || null,
      favorites,
      recentChats,
      usageData,
      categoryBreakdown
    });
  } catch (err) {
    console.error("getDashboard error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard };
