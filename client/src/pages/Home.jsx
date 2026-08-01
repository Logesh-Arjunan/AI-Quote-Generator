import { useState, useEffect, useCallback } from "react";
import { FaBolt, FaInfinity } from "react-icons/fa";
import { HiLightBulb, HiArrowPath, HiSparkles, HiChatBubbleLeftRight } from "react-icons/hi2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryDropdown from "../components/CategoryDropdown";
import LanguageSelector from "../components/LanguageSelector";
import LengthSelector from "../components/LengthSelector";
import QuoteCard from "../components/QuoteCard";
import Loading from "../components/Loading";
import ChatAssistant from "../components/ChatAssistant";
import { generateQuote } from "../services/api";
import { useUserData } from "../context/UserDataContext";
import { useTheme } from "../context/ThemeContext";

const gradients = [
  "from-blue-50 via-indigo-50 to-purple-50",
  "from-purple-50 via-pink-50 to-rose-50",
  "from-cyan-50 via-blue-50 to-indigo-50",
  "from-emerald-50 via-teal-50 to-cyan-50",
  "from-orange-50 via-amber-50 to-yellow-50",
  "from-violet-50 via-purple-50 to-fuchsia-50",
];

const darkGradients = [
  "from-gray-950 via-gray-900 to-gray-950",
  "from-gray-950 via-indigo-950/30 to-gray-950",
  "from-gray-950 via-purple-950/30 to-gray-950",
  "from-gray-950 via-blue-950/30 to-gray-950",
];

const Home = () => {
  const { addQuote } = useUserData();
  const { darkMode, toggleDark } = useTheme();
  const [mode, setMode] = useState("generator"); // "generator" | "chat"
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [length, setLength] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteItem, setQuoteItem] = useState(null);
  const [quoteCategory, setQuoteCategory] = useState("");
  const [quoteLanguage, setQuoteLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgGradient, setBgGradient] = useState(0);
  const [quoteOfDay, setQuoteOfDay] = useState("");

  // Dark mode is now managed by ThemeContext (see useTheme above)

  useEffect(() => {
    setQuoteOfDay(
      "The only way to do great work is to love what you do. Start where you are, use what you have, and do what you can."
    );
  }, []);

  const randomizeGradient = useCallback(() => {
    const max = darkMode ? darkGradients.length : gradients.length;
    setBgGradient((prev) => (prev + 1) % max);
  }, [darkMode]);

  useEffect(() => {
    randomizeGradient();
  }, [randomizeGradient]);

  const handleGenerate = useCallback(async () => {
    if (!category || !language || !length) {
      setError("Please select a category, language, and quote length.");
      return;
    }

    setLoading(true);
    setError("");
    setQuote("");
    randomizeGradient();

    try {
      const data = await generateQuote(category, language, length);
      if (data.success) {
        const newItem = {
          id: Date.now(),
          category,
          quote: data.quote,
          language,
          generatedAt: new Date().toISOString(),
        };
        setQuote(data.quote);
        setQuoteItem(newItem);
        setQuoteCategory(category);
        setQuoteLanguage(language);
        addQuote(category, data.quote, language);
      } else {
        setError("Unable to generate quote. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Unable to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, language, length, randomizeGradient, addQuote]);

  const handleGenerateAnother = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleKeyDown = useCallback(
    (e) => {
      // Only trigger in generator mode and when no input/textarea is focused
      const tag = document.activeElement?.tagName;
      if (e.key === "Enter" && !loading && mode === "generator" && tag !== "INPUT" && tag !== "TEXTAREA") {
        handleGenerate();
      }
    },
    [handleGenerate, loading, mode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentGradient = darkMode
    ? darkGradients[bgGradient]
    : gradients[bgGradient];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentGradient} transition-all duration-1000`}
    >
      <Navbar />

      {/* Dark Mode Toggle */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={toggleDark}
          className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-fadeIn">
            <HiSparkles />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight animate-fadeIn">
            Generate Unlimited
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              AI Quotes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
            Choose a category and let AI create a unique quote instantly.
            Every quote is original, fresh, and crafted just for you.
          </p>
        </section>

        {/* Quote of the Day */}
        <section className="mb-8 animate-fadeIn">
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 border border-blue-200/50 dark:border-blue-800/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <HiLightBulb className="text-yellow-500 text-xl" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Quote of the Day
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              &ldquo;{quoteOfDay}&rdquo;
            </p>
          </div>
        </section>

        {/* Mode Tab Switcher */}
        <section className="mb-8 animate-fadeIn">
          <div className="max-w-xl mx-auto">
            <div className="flex gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-1.5 border border-white/40 dark:border-gray-700/40 shadow-sm">
              <button
                onClick={() => setMode("generator")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center transition-all duration-200
                  ${mode === "generator"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/25"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/40"}`}
              >
                <HiSparkles />
                Quote Generator
              </button>
              <button
                onClick={() => setMode("chat")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center transition-all duration-200
                  ${mode === "chat"
                    ? "bg-gradient-to-r from-violet-500 to-blue-600 text-white shadow-md shadow-violet-500/25"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/40"}`}
              >
                <HiChatBubbleLeftRight />
                AI Quote Assistant
              </button>
            </div>
          </div>
        </section>

        {/* Generator or Chat */}
        {mode === "generator" && (
          <>
            {/* Generator Card */}
            <section id="generate" className="mb-12 animate-fadeIn">
              <div className="max-w-xl mx-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 p-6 sm:p-8 shadow-2xl shadow-blue-500/5 dark:shadow-purple-500/5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
                  <FaBolt className="text-blue-500" />
                  Configure Your Quote
                </h2>
                <div className="space-y-5">
                  <CategoryDropdown selected={category} onChange={setCategory} />
                  <LanguageSelector selected={language} onChange={setLanguage} />
                  <LengthSelector selected={length} onChange={setLength} />
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-blue-500/25"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <HiSparkles />
                        Generate Quote
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono text-[10px]">Enter</kbd> to generate
                  </p>
                </div>
              </div>
            </section>

            {/* Result Section */}
            <section className="mb-12 min-h-[100px]">
              {loading && <Loading />}
              {error && !loading && (
                <div className="max-w-xl mx-auto animate-fadeIn">
                  <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <button onClick={handleGenerate} className="mt-3 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300 flex items-center justify-center gap-1 mx-auto transition-colors">
                      <HiArrowPath className="text-xs" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              {quote && !loading && (
                <QuoteCard quote={quote} category={quoteCategory} language={quoteLanguage} onGenerateAnother={handleGenerateAnother} quoteItem={quoteItem} />
              )}
            </section>
          </>
        )}

        {/* Chat Mode */}
        {mode === "chat" && (
          <section className="mb-12 animate-fadeIn">
            <ChatAssistant />
          </section>
        )}

        {/* Features Section */}
        <section id="about" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
            Why Choose AI Quote Generator?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <HiSparkles className="text-2xl" />,
                title: "AI-Powered",
                desc: "Every quote is uniquely generated by Google Gemini AI, not copied from any database.",
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: <FaInfinity className="text-2xl" />,
                title: "Unlimited Quotes",
                desc: "Generate as many quotes as you want. No limits, no repetitions, always fresh content.",
                color: "text-purple-500",
                bg: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                icon: <FaBolt className="text-2xl" />,
                title: "Instant Generation",
                desc: "Get your quote in seconds. Fast API response with real-time AI processing.",
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                icon: <FaBolt className="text-2xl" />,
                title: "Multi-Language",
                desc: "Generate quotes in English and Tamil. More languages coming soon.",
                color: "text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;