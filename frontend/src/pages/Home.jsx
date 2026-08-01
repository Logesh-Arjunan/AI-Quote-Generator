import { useState, useRef } from "react";
import { quoteAPI } from "../services/api";
import { FaCopy, FaDownload, FaRedo, FaShareAlt, FaSpinner } from "react-icons/fa";
import html2canvas from "html2canvas";

export default function Home() {
  const [category, setCategory] = useState("Motivation");
  const [tone, setTone] = useState("Inspirational");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("Short");
  
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setQuote("");
    setCopied(false);

    try {
      const data = await quoteAPI.generate({ category, tone, language, length });
      if (data.success) {
        setQuote(data.quote);
      } else {
        setError("Groq API Error");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy quote.");
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1e293b",
        scale: 2
      });
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      setError("Download failed.");
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent(`"${quote}" - Generated with AI Quote Generator`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Quote Generator
        </h1>
        <p className="text-center text-sm text-slate-500 mb-8">Powered by Groq Llama 3.3 70B</p>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-400 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="Motivation">Motivation</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Wisdom">Wisdom</option>
              <option value="Success">Success</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="Inspirational">Inspirational</option>
              <option value="Philosophical">Philosophical</option>
              <option value="Humorous">Humorous</option>
              <option value="Poetic">Poetic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Length</label>
            <select value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin text-lg" /> : "Generate Quote"}
        </button>

        {/* Quote display section */}
        {quote && (
          <div className="mt-8 animate-fadeIn">
            <div ref={cardRef} className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl text-center mb-6">
              <p className="text-xl md:text-2xl font-serif text-slate-100 italic leading-relaxed">
                "{quote}"
              </p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-305 text-sm font-semibold rounded-xl transition-all">
                <FaCopy /> {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-305 text-sm font-semibold rounded-xl transition-all">
                <FaDownload /> Download
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-305 text-sm font-semibold rounded-xl transition-all">
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
