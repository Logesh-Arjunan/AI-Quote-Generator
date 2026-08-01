import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiChatBubbleLeftRight, HiSparkles, HiChartBar, HiClockRotateLeft,
  HiPlus, HiTrash, HiChevronLeft, HiChevronRight, HiArrowRightOnRectangle,
  HiSun, HiMoon, HiUser, HiQuestionMarkCircle
} from "react-icons/hi2";
import { FaQuoteLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { chatAPI } from "../services/api";
import { toast } from "./Toast";

const NAV = [
  { to: "/dashboard", label: "Dashboard",      icon: <HiChartBar /> },
  { to: "/chat",      label: "AI Chat",         icon: <HiChatBubbleLeftRight /> },
  { to: "/generate",  label: "Quote Generator", icon: <HiSparkles /> },
  { to: "/history",   label: "Quote History",   icon: <HiClockRotateLeft /> },
];

export default function Sidebar({ onNewChat, activeChatId, chats = [], refreshChats }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleNewChat = async () => {
    try {
      const { data } = await chatAPI.create("New Conversation");
      if (refreshChats) refreshChats();
      navigate(`/chat/${data.chat._id}`);
    } catch {
      toast("Failed to create chat", "error");
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await chatAPI.delete(chatId);
      if (refreshChats) refreshChats();
      if (location.pathname.includes(chatId)) navigate("/chat");
      toast("Chat deleted", "success");
    } catch {
      toast("Failed to delete chat", "error");
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const initials = user?.name?.slice(0, 2).toUpperCase() || "U";

  return (
    <aside className={`flex flex-col h-screen bg-gray-950 dark:bg-gray-950 border-r border-gray-800/60 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[64px]" : "w-[260px]"}`}>

      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-3 pt-4 pb-3 border-b border-gray-800/60 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <FaQuoteLeft className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-tight truncate">QuoteGPT</p>
              <p className="text-[10px] text-gray-500 truncate">AI Assistant</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto">
            <FaQuoteLeft className="text-white text-sm" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all ${collapsed ? "mx-auto mt-0" : ""}`}
        >
          {collapsed ? <HiChevronRight className="text-base" /> : <HiChevronLeft className="text-base" />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-2 py-2 flex-shrink-0">
        <button
          onClick={handleNewChat}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-blue-700 transition-all shadow-md shadow-violet-500/20 ${collapsed ? "justify-center" : ""}`}
          title="New Chat"
        >
          <HiPlus className="text-base flex-shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 pb-2 flex-shrink-0">
        {NAV.map(item => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Recent Chats (only on chat page, not collapsed) */}
      {!collapsed && chats.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col px-2 pb-2">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-1.5">Recent Chats</p>
          <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-hide">
            {chats.slice(0, 20).map(chat => (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className={`group flex items-center justify-between gap-1 px-2.5 py-2 rounded-xl text-xs transition-all ${
                  activeChatId === chat._id
                    ? "bg-violet-600/20 text-violet-300"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <HiChatBubbleLeftRight className="flex-shrink-0 text-xs text-gray-500" />
                  <span className="truncate">{chat.title || "New Conversation"}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-all flex-shrink-0"
                >
                  <HiTrash className="text-xs" />
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
      {!collapsed && chats.length === 0 && <div className="flex-1" />}
      {collapsed && <div className="flex-1" />}

      {/* Bottom: Theme + User + Logout */}
      <div className="px-2 py-2 border-t border-gray-800/60 space-y-1 flex-shrink-0">
        <button
          onClick={toggleDark}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition-all ${collapsed ? "justify-center" : ""}`}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <HiSun className="text-yellow-400 text-base flex-shrink-0" /> : <HiMoon className="text-blue-400 text-base flex-shrink-0" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-900/60">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-all ${collapsed ? "justify-center" : ""}`}
          title="Logout"
        >
          <HiArrowRightOnRectangle className="text-base flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
