import { useState, useEffect, useRef, useCallback } from "react";
import { HiSparkles, HiPaperAirplane } from "react-icons/hi2";
import { FaUserCircle, FaRobot, FaQuoteLeft } from "react-icons/fa";
import { sendChatMessage } from "../services/api";
import { useUserData } from "../context/UserDataContext";

/* ─── Quick suggestion chips ─────────────────────────────────────── */
const SUGGESTIONS = [
  "I need motivation.",
  "Give me a success quote.",
  "I'm feeling stressed about my exams.",
  "How do I stay disciplined?",
  "Generate another quote.",
];

/* ─── Typing dots animation ─────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4 animate-fadeIn">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs shadow-md flex-shrink-0">
        <HiSparkles />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Single message bubble ─────────────────────────────────────── */
function MessageBubble({ msg, profile }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex items-end gap-3 mb-4 animate-fadeIn ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0
        ${isUser
          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
          : "bg-gradient-to-br from-violet-500 to-blue-500"}`}
      >
        {isUser
          ? (profile?.name?.charAt(0) || <FaUserCircle />)
          : <HiSparkles />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] sm:max-w-[65%] group`}>
        <div className={`px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-line
          ${isUser
            ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-blue-500/20"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-2xl rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <p className={`text-[10px] text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

/* ─── Main ChatAssistant component ──────────────────────────────── */
export default function ChatAssistant() {
  const { profile, addChatExchange } = useUserData();

  const INITIAL_MSG = {
    id: "init",
    role: "ai",
    text: `Hey ${profile?.name || "there"}! 👋 I'm your AI Quote Assistant.\n\nTell me how you're feeling, ask for a quote on any topic, or request an explanation — I'm here to inspire and guide you!`,
    timestamp: Date.now(),
  };

  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setError("");
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build message history for the API (exclude the initial greeting)
    const history = messages
      .filter(m => m.id !== "init")
      .map(m => ({ role: m.role === "user" ? "user" : "model", text: m.text }));

    history.push({ role: "user", text: trimmed });

    try {
      const data = await sendChatMessage(history);
      const aiText = data.success ? data.response : "I couldn't process that. Please try again.";

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: aiText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
      addChatExchange(trimmed, aiText);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, addChatExchange]);

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    sendMessage(text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Chat Window ─────────────────────────────────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-2xl shadow-blue-500/5 flex flex-col"
        style={{ height: "580px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg shadow-inner">
            <FaRobot />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base tracking-tight">AI Quote Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70">Online · Powered by Gemini AI</span>
            </div>
          </div>
          <HiSparkles className="text-yellow-300 text-xl" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} profile={profile} />
          ))}
          {isTyping && <TypingIndicator />}
          {error && (
            <div className="text-center py-2 animate-fadeIn">
              <span className="text-xs text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800">
                {error}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only show when no conversation yet or last message is AI) */}
        {messages.length <= 2 && (
          <div className="px-5 pb-3 flex-shrink-0">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 font-medium">Quick suggestions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-400 transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 flex-shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  // auto-grow up to 3 rows
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask for a quote, motivation, or explanation…"
                disabled={isTyping}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all resize-none leading-relaxed disabled:opacity-50"
                style={{ minHeight: "46px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-200 flex-shrink-0
                ${input.trim() && !isTyping
                  ? "bg-gradient-to-br from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50"
                }`}
            >
              <HiPaperAirplane className="text-base" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[10px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[10px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
