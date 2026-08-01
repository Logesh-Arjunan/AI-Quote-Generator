import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart, FaQuoteLeft, FaTrash,
  FaClipboard, FaCheck, FaStar, FaFire, FaCalendarAlt,
  FaBolt, FaChartLine, FaPen, FaSave, FaTimes
} from "react-icons/fa";
import {
  HiSparkles, HiChatBubbleLeftRight, HiChartBar,
  HiArrowLeft, HiClock, HiTag, HiSun, HiCheckCircle, HiMoon
} from "react-icons/hi2";
import { useUserData } from "../context/UserDataContext";
import { useTheme } from "../context/ThemeContext";

/* ─── Utilities ─────────────────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ─── Reusable Components ────────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Copy">
      {copied ? <FaCheck className="text-green-500 text-xs" /> : <FaClipboard className="text-xs" />}
    </button>
  );
}

function CategoryBadge({ category }) {
  const colors = {
    Motivation: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    Success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    Discipline: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    Creativity: "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300",
    Leadership: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    Happiness: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    Friendship: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
    Life: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
    Technology: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[category] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
      {category}
    </span>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sublabel, gradient, glowColor }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${gradient} hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}>
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30 ${glowColor}`} />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-4">{icon}</div>
        <p className="text-4xl font-black tracking-tight mb-1">{value}</p>
        <p className="text-sm font-semibold text-white/90">{label}</p>
        {sublabel && <p className="text-xs text-white/60 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────────────────────── */
function SectionCard({ title, icon, subtitle, children, action }) {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base shadow-md">{icon}</div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-none">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600 text-2xl mx-auto mb-3">{icon}</div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

/* ─── Weekly Activity Chart ──────────────────────────────────────────────── */
function WeeklyActivityChart({ quoteHistory }) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = d.toDateString();
    const count = quoteHistory.filter(q => new Date(q.generatedAt).toDateString() === dateStr).length;
    days.push({ label, count, isToday: i === 0 });
  }

  const maxCount = Math.max(...days.map(d => d.count), 1);

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base shadow-md">
          <HiChartBar />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-none">Weekly Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">Quotes generated per day</p>
        </div>
      </div>

      <div className="flex items-end gap-2 sm:gap-3 h-32">
        {days.map(({ label, count, isToday }) => {
          const heightPct = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 8 : 2) : 2;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              {/* Count label */}
              <span className={`text-xs font-bold transition-all ${count > 0 ? (isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400") : "text-gray-300 dark:text-gray-600"}`}>
                {count > 0 ? count : ""}
              </span>
              {/* Bar */}
              <div className="w-full flex items-end" style={{ height: "80px" }}>
                <div
                  className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                    isToday
                      ? "bg-gradient-to-t from-blue-600 to-violet-500 shadow-lg shadow-blue-500/30"
                      : count > 0
                        ? "bg-gradient-to-t from-blue-400/70 to-purple-400/70 dark:from-blue-500/50 dark:to-purple-500/50"
                        : "bg-gray-100 dark:bg-gray-700/50"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              {/* Day label */}
              <span className={`text-[11px] font-semibold ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
                {isToday ? "Today" : label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-blue-600 to-violet-500" />
          Today
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-blue-400/70 to-purple-400/70" />
          Previous days
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
          No activity
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Profile Panel ─────────────────────────────────────────────────── */
const AVATAR_EMOJIS = ["🧠","🚀","🌟","💡","🎯","🦁","🔥","⚡","🌈","🎨","🎭","🎮","🌺","🦋","🐉","🏆"];

function EditProfilePanel({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATAR_EMOJIS.includes(profile.avatar) ? profile.avatar : null
  );
  const [useInitials, setUseInitials] = useState(!AVATAR_EMOJIS.includes(profile.avatar));

  const computedAvatar = useInitials
    ? (name.slice(0, 2).toUpperCase() || "U")
    : (selectedAvatar || "🚀");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), avatar: computedAvatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-800 shadow-2xl shadow-black/20 border border-white/40 dark:border-gray-700/40 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar preview */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-violet-500/30">
              {computedAvatar}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all text-sm"
            />
          </div>

          {/* Avatar mode toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avatar Style</label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setUseInitials(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${useInitials ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                Use Initials
              </button>
              <button
                onClick={() => setUseInitials(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${!useInitials ? "bg-violet-500 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                Use Emoji
              </button>
            </div>

            {!useInitials && (
              <div className="grid grid-cols-8 gap-1.5">
                {AVATAR_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`w-full aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedAvatar === emoji
                        ? "bg-violet-100 dark:bg-violet-900/40 ring-2 ring-violet-500 scale-110"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-105"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab definitions ────────────────────────────────────────────────────── */
const TABS = [
  { id: "dashboard", label: "Dashboard",       icon: <HiChartBar /> },
  { id: "quotes",    label: "Quote History",   icon: <FaQuoteLeft /> },
  { id: "chat",      label: "Conversations",   icon: <HiChatBubbleLeftRight /> },
  { id: "favorites", label: "Favorites",       icon: <FaHeart /> },
];

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function Profile() {
  const {
    profile, quoteHistory, chatHistory, favorites, lastLogin,
    totalQuotes, todayActivity, mostUsedCategory, currentStreak,
    todayQuote, toggleFavorite, isFavorite, updateProfile,
  } = useUserData();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editOpen, setEditOpen] = useState(false);

  const { darkMode, toggleDark } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FaQuoteLeft className="text-white text-lg" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Quote Generator</span>
                <p className="text-[10px] text-gray-400 -mt-1 flex items-center gap-1">
                  Powered by <HiSparkles className="text-purple-500" /> Gemini AI
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode
                  ? <HiSun className="w-4 h-4 text-yellow-400" />
                  : <HiMoon className="w-4 h-4 text-gray-500" />
                }
              </button>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <HiArrowLeft />
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* ── Profile Banner ──────────────────────────────────────────────── */}
        <section className="mb-6 mt-6 animate-fadeIn">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/40 dark:border-gray-700/40">
            {/* Gradient banner */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500">
              <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle at 15% 60%,rgba(255,255,255,.18) 0%,transparent 50%),radial-gradient(circle at 80% 40%,rgba(255,255,255,.12) 0%,transparent 50%)"}} />
              {[...Array(6)].map((_,i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"
                  style={{top:`${20+i*12}%`,left:`${10+i*15}%`,animationDelay:`${i*0.4}s`}} />
              ))}
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-violet-500/30 border-4 border-white dark:border-gray-800 flex-shrink-0">
                  {profile.avatar || profile.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="pb-1 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{profile.name}</h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <HiCheckCircle /> Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                </div>
                {/* Edit button */}
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 self-end sm:self-auto"
                >
                  <FaPen className="text-xs" /> Edit Profile
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-blue-400"/>Joined {formatDate(profile.joinedDate)}</span>
                <span className="flex items-center gap-1.5"><HiClock className="text-purple-400"/>Last login {formatDate(lastLogin)}</span>
                <span className="flex items-center gap-1.5"><FaFire className="text-orange-400"/>{currentStreak} day streak</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <section className="mb-6 animate-fadeIn">
          <div className="flex gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-1.5 border border-white/40 dark:border-gray-700/40 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center
                  ${activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/25"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/40"}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            DASHBOARD TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">

            {/* Welcome + Today's Quote */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-white/40 dark:border-gray-700/40 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 text-white relative">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 80% 20%,#fff 0%,transparent 50%)"}} />
              <div className="relative p-8">
                <div className="flex items-center gap-2 mb-2 text-white/70 text-sm font-medium">
                  <HiSun className="text-yellow-300 text-lg" />
                  {getGreeting()}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-6">
                  Welcome back, <span className="text-yellow-300">{profile.name}</span> 👋
                </h2>
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                  <div className="flex items-start gap-3">
                    <FaQuoteLeft className="text-yellow-300 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-widest">Today's Quote</p>
                      <p className="text-white text-lg leading-relaxed font-medium italic">"{todayQuote}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<FaQuoteLeft />} label="Total Quotes" value={totalQuotes} sublabel="All time"
                gradient="bg-gradient-to-br from-blue-500 to-blue-700" glowColor="bg-blue-300" />
              <StatCard icon={<FaHeart />} label="Favorites" value={favorites.length} sublabel="Saved quotes"
                gradient="bg-gradient-to-br from-pink-500 to-rose-600" glowColor="bg-pink-300" />
              <StatCard icon={<FaBolt />} label="Today's Activity" value={todayActivity} sublabel="Quotes generated"
                gradient="bg-gradient-to-br from-amber-500 to-orange-600" glowColor="bg-amber-300" />
              <StatCard icon={<HiTag />} label="Top Category" value={mostUsedCategory} sublabel="Your fav"
                gradient="bg-gradient-to-br from-violet-500 to-purple-700" glowColor="bg-violet-300" />
            </div>

            {/* Weekly Activity Chart */}
            <WeeklyActivityChart quoteHistory={quoteHistory} />

            {/* Bottom two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Quotes */}
              <SectionCard title="Recent Quotes" icon={<FaChartLine />} subtitle={`${quoteHistory.length} total`}
                action={<button onClick={() => setActiveTab("quotes")} className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">View all →</button>}
              >
                {quoteHistory.length === 0 ? (
                  <EmptyState icon={<FaQuoteLeft />} message="Generate your first quote!" />
                ) : (
                  <div className="space-y-3">
                    {quoteHistory.slice(0, 5).map(item => (
                      <div key={item.id} className="group flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-700/40 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
                          <FaQuoteLeft />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">{item.quote}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <CategoryBadge category={item.category} />
                            <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(item.generatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <CopyButton text={item.quote} />
                          <button onClick={() => toggleFavorite(item)}
                            className={`p-1.5 rounded-lg transition-all ${isFavorite(item.id) ? "text-pink-500" : "text-gray-300 dark:text-gray-600 hover:text-pink-400"}`}>
                            <FaHeart className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Recent Conversations */}
              <SectionCard title="Recent Conversations" icon={<HiChatBubbleLeftRight />} subtitle={`${chatHistory.length} exchanges`}
                action={<button onClick={() => setActiveTab("chat")} className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">View all →</button>}
              >
                {chatHistory.length === 0 ? (
                  <EmptyState icon={<HiChatBubbleLeftRight />} message="Start a chat with your AI Mentor!" />
                ) : (
                  <div className="space-y-3">
                    {chatHistory.slice(0, 4).map(item => (
                      <div key={item.id} className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {profile.name?.charAt(0)}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-1 flex-1">{item.userMessage}</p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(item.time)}</span>
                        </div>
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-white dark:bg-gray-800/50">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                            <HiSparkles className="text-[10px]" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 flex-1 leading-relaxed">{item.aiResponse}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Favorite Quotes preview */}
            {favorites.length > 0 && (
              <SectionCard title="Favorite Quotes" icon={<FaStar />} subtitle={`${favorites.length} saved`}
                action={<button onClick={() => setActiveTab("favorites")} className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">View all →</button>}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.slice(0, 4).map(item => (
                    <div key={item.id} className="group rounded-xl bg-gradient-to-br from-pink-50/80 to-white dark:from-pink-900/10 dark:to-gray-800/60 border border-pink-100 dark:border-pink-900/30 p-4 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-md transition-all">
                      <div className="flex gap-2 mb-2">
                        <FaQuoteLeft className="text-pink-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">{item.quote}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <CategoryBadge category={item.category} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton text={item.quote} />
                          <button onClick={() => toggleFavorite(item)} className="p-1.5 rounded-lg text-pink-400 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-all">
                            <FaHeart className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            QUOTE HISTORY TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "quotes" && (
          <div className="animate-fadeIn">
            <SectionCard title="Quote History" icon={<FaQuoteLeft />} subtitle={`${quoteHistory.length} quotes generated`}>
              {quoteHistory.length === 0 ? (
                <EmptyState icon={<FaQuoteLeft />} message="No quotes yet. Generate your first one!" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        {["Category", "Quote", "Language", "Generated", ""].map(h => (
                          <th key={h} className="text-left py-3 px-4 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/40">
                      {quoteHistory.map(item => (
                        <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <td className="py-3 px-4"><CategoryBadge category={item.category} /></td>
                          <td className="py-3 px-4">
                            <p className="text-gray-700 dark:text-gray-300 max-w-sm line-clamp-2">{item.quote}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">{item.language}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(item.generatedAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <CopyButton text={item.quote} />
                              <button onClick={() => toggleFavorite(item)}
                                className={`p-1.5 rounded-lg transition-all ${isFavorite(item.id) ? "text-pink-500" : "text-gray-300 dark:text-gray-600 hover:text-pink-400"}`}>
                                <FaHeart className="text-xs" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CONVERSATIONS TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "chat" && (
          <div className="animate-fadeIn">
            <SectionCard title="Conversation History" icon={<HiChatBubbleLeftRight />} subtitle={`${chatHistory.length} exchanges`}>
              {chatHistory.length === 0 ? (
                <EmptyState icon={<HiChatBubbleLeftRight />} message="No conversations yet. Chat with your AI Mentor!" />
              ) : (
                <div className="space-y-4">
                  {chatHistory.map(item => (
                    <div key={item.id} className="rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-blue-200 dark:hover:border-blue-800/50 transition-all">
                      <div className="flex items-start gap-3 px-5 py-4 bg-blue-50/60 dark:bg-blue-900/10">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {profile.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 text-sm">{item.userMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(item.time)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 px-5 py-4 bg-white dark:bg-gray-800/60">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                          <HiSparkles className="text-xs" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line flex-1">{item.aiResponse}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            FAVORITES TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "favorites" && (
          <div className="animate-fadeIn">
            <SectionCard title="Favorite Quotes" icon={<FaStar />} subtitle={`${favorites.length} saved quotes`}>
              {favorites.length === 0 ? (
                <EmptyState icon={<FaHeart />} message="No favorites yet. Heart a quote to save it here!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {favorites.map(item => (
                    <div key={item.id} className="group rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-gradient-to-br from-pink-50/60 to-white dark:from-pink-900/10 dark:to-gray-800/60 p-5 hover:shadow-lg hover:border-pink-300 dark:hover:border-pink-700 transition-all">
                      <div className="flex items-start gap-2.5 mb-3">
                        <FaQuoteLeft className="text-pink-400 text-base flex-shrink-0 mt-1" />
                        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{item.quote}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          <CategoryBadge category={item.category} />
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">{item.language}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton text={item.quote} />
                          <button onClick={() => toggleFavorite(item)} className="p-1.5 rounded-lg text-pink-400 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-all" title="Remove">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2.5">Saved {formatDate(item.savedAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfilePanel
          profile={profile}
          onSave={updateProfile}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
