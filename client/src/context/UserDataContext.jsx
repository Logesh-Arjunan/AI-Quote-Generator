import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserDataContext = createContext(null);

const DEFAULT_PROFILE = {
  name: "Logesh",
  email: "logesh@example.com",
  avatar: "LG",
  joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
};

// Seed demo data for a rich first-time experience
function generateSeedQuotes() {
  const categories = ["Motivation", "Success", "Discipline", "Creativity", "Leadership", "Happiness", "Motivation", "Motivation", "Success", "Discipline"];
  const quotes = [
    "Every morning is a fresh canvas — paint it with intention and courage.",
    "Success is not a destination but a direction. Keep moving forward.",
    "Discipline is the silent architect of extraordinary lives.",
    "Creativity is the art of seeing what others overlook and making it matter.",
    "A true leader empowers others to discover strengths they never knew they had.",
    "Happiness grows where gratitude is planted.",
    "Your consistency today is the miracle someone else is praying for tomorrow.",
    "Push through the resistance — that's where champions are forged.",
    "Small wins compounded daily become the greatest victories.",
    "The gap between who you are and who you want to be is called discipline.",
  ];
  const languages = ["English", "English", "English", "English", "English", "Tamil", "English", "English", "English", "English"];
  const now = Date.now();
  const result = [];

  // Spread 148 historical quotes over the past 30 days
  for (let i = 0; i < 148; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const cat = categories[i % categories.length];
    result.push({
      id: now - i * 7200000 - daysAgo * 86400000,
      category: cat,
      quote: quotes[i % quotes.length],
      language: languages[i % languages.length],
      generatedAt: new Date(now - daysAgo * 86400000 - i * 3600000).toISOString(),
    });
  }

  // 5 quotes generated today
  for (let i = 0; i < 10; i++) {
    const cat = ["Motivation", "Success", "Creativity", "Leadership", "Discipline"][i % 5];
    result.unshift({
      id: now - i * 600000,
      category: cat,
      quote: quotes[i % quotes.length],
      language: "English",
      generatedAt: new Date(now - i * 600000).toISOString(),
    });
  }

  return result;
}

function generateSeedFavorites(quotes) {
  return quotes.slice(0, 24).map(q => ({
    ...q,
    savedAt: new Date(Date.parse(q.generatedAt) + 60000).toISOString(),
  }));
}

function generateSeedChats() {
  const exchanges = [
    {
      userMessage: "I'm feeling stressed about my exams.",
      aiResponse: "Remember, every challenge is preparing you for something greater.\nWould you like some study motivation tips?",
    },
    {
      userMessage: "Yes",
      aiResponse: "1. Study in 25-minute sessions.\n2. Take short breaks.\n3. Focus on one subject at a time.\n\nToday's Motivation:\n\"The future belongs to those who prepare today.\"",
    },
    {
      userMessage: "Generate another quote.",
      aiResponse: "Small consistent efforts create extraordinary results.",
    },
    {
      userMessage: "How can I stay motivated every day?",
      aiResponse: "Motivation follows action, not the other way around. Start small — just begin. Each small win releases dopamine and builds momentum.\n\n\"The habit of beginning is the secret of every great achiever.\"",
    },
    {
      userMessage: "Give me a leadership quote.",
      aiResponse: "Here's one crafted just for you:\n\n\"A true leader empowers others to discover strengths they never knew they had.\"",
    },
  ];
  const now = Date.now();
  return exchanges.map((e, i) => ({
    id: now - (exchanges.length - i) * 3600000,
    userMessage: e.userMessage,
    aiResponse: e.aiResponse,
    time: new Date(now - (exchanges.length - i) * 3600000).toISOString(),
  }));
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return fallback;
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

export function UserDataProvider({ children }) {
  const [profile, setProfile] = useState(() => loadFromStorage("aqg_profile", DEFAULT_PROFILE));

  const updateProfile = useCallback((patch) => {
    setProfile(prev => {
      const updated = { ...prev, ...patch };
      saveToStorage("aqg_profile", updated);
      return updated;
    });
  }, []);

  const [quoteHistory, setQuoteHistory] = useState(() => {
    const stored = loadFromStorage("aqg_quoteHistory", null);
    if (stored && stored.length > 0) return stored;
    const seeded = generateSeedQuotes();
    saveToStorage("aqg_quoteHistory", seeded);
    return seeded;
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const stored = loadFromStorage("aqg_chatHistory", null);
    if (stored && stored.length > 0) return stored;
    const seeded = generateSeedChats();
    saveToStorage("aqg_chatHistory", seeded);
    return seeded;
  });

  const [favorites, setFavorites] = useState(() => {
    const stored = loadFromStorage("aqg_favorites", null);
    if (stored && stored.length > 0) return stored;
    // seed will be generated after quoteHistory is known — use static seed
    const allQuotes = loadFromStorage("aqg_quoteHistory", []);
    const seeded = generateSeedFavorites(allQuotes);
    saveToStorage("aqg_favorites", seeded);
    return seeded;
  });

  const [lastLogin] = useState(() => {
    const stored = loadFromStorage("aqg_lastLogin", null);
    const today = new Date().toISOString();
    saveToStorage("aqg_lastLogin", today);
    return stored || today;
  });

  useEffect(() => { saveToStorage("aqg_quoteHistory", quoteHistory); }, [quoteHistory]);
  useEffect(() => { saveToStorage("aqg_chatHistory", chatHistory); }, [chatHistory]);
  useEffect(() => { saveToStorage("aqg_favorites", favorites); }, [favorites]);

  const addQuote = useCallback((category, quote, language) => {
    setQuoteHistory(prev => [{
      id: Date.now(),
      category,
      quote,
      language,
      generatedAt: new Date().toISOString(),
    }, ...prev].slice(0, 500));
  }, []);

  const addChatExchange = useCallback((userMessage, aiResponse) => {
    setChatHistory(prev => [{
      id: Date.now(),
      userMessage,
      aiResponse,
      time: new Date().toISOString(),
    }, ...prev].slice(0, 200));
  }, []);

  const toggleFavorite = useCallback((quoteItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === quoteItem.id);
      if (exists) return prev.filter(f => f.id !== quoteItem.id);
      return [{ ...quoteItem, savedAt: new Date().toISOString() }, ...prev].slice(0, 100);
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  // Computed stats
  const totalQuotes = quoteHistory.length;

  const todayStr = new Date().toDateString();
  const todayActivity = quoteHistory.filter(q => new Date(q.generatedAt).toDateString() === todayStr).length;

  const mostUsedCategory = (() => {
    if (!quoteHistory.length) return "Motivation";
    const counts = {};
    quoteHistory.forEach(q => { counts[q.category] = (counts[q.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Motivation";
  })();

  const currentStreak = (() => {
    if (!quoteHistory.length) return 0;
    const days = new Set(quoteHistory.map(q => new Date(q.generatedAt).toDateString()));
    let streak = 0;
    const d = new Date();
    while (days.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak || 7; // fallback for demo
  })();

  // Today's featured quote
  const todayQuote = (() => {
    const dayIndex = new Date().getDate() % 10;
    const todayQuotes = [
      "The only way to do great work is to love what you do. Start where you are, use what you have, do what you can.",
      "Every morning carries the seed of a new beginning. Water it with intention.",
      "Your discipline today is the freedom you will enjoy tomorrow.",
      "Success is built one consistent decision at a time.",
      "Be the energy you want to attract into your world.",
      "Growth begins the moment you step past your comfort zone.",
      "Small steps taken every day lead to the grandest destinations.",
      "Believe in the version of yourself that's still becoming.",
      "Clarity of purpose transforms ordinary effort into extraordinary results.",
      "The best investment you can make is in your own potential.",
    ];
    return todayQuotes[dayIndex];
  })();

  return (
    <UserDataContext.Provider value={{
      profile,
      quoteHistory,
      chatHistory,
      favorites,
      lastLogin,
      totalQuotes,
      todayActivity,
      mostUsedCategory,
      currentStreak,
      todayQuote,
      addQuote,
      addChatExchange,
      toggleFavorite,
      isFavorite,
      updateProfile,
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
