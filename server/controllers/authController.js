const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Email is already registered." });

    const user = await User.create({ name, email: email.toLowerCase(), password });
    const token = generateToken(user._id);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password." });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, lastLogin: user.lastLogin, stats: user.stats }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// GET /api/auth/profile  (protected)
const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, lastLogin: req.user.lastLogin, stats: req.user.stats, createdAt: req.user.createdAt }
  });
};

module.exports = { register, login, getProfile };
