import React, { useState, useEffect } from 'react';
import { FiCpu, FiCompass, FiSmile, FiFeather, FiCheck } from 'react-icons/fi';

const TOPICS = ['Motivation', 'Success', 'Wisdom', 'Love', 'Leadership', 'Happiness', 'Creativity'];
const TONES = [
  { value: 'Inspirational', label: '✨ Inspirational' },
  { value: 'Philosophical', label: '💭 Philosophical' },
  { value: 'Witty', label: '💡 Witty' },
  { value: 'Serious', label: '👔 Serious' },
  { value: 'Poetic', label: '🪶 Poetic' },
  { value: 'Humorous', label: '🎭 Humorous' },
];
const LENGTHS = [
  { value: 'short', label: 'Short', desc: '1-12 words' },
  { value: 'medium', label: 'Medium', desc: '13-25 words' },
  { value: 'long', label: 'Long', desc: '26+ words' },
];

const LOADING_STEPS = [
  'Connecting to Groq Llama 3.3...',
  'Analyzing selected topic and tone parameters...',
  'Generating creative thought structures...',
  'Refining quote phrasing...',
  'Finalizing formatting details...',
];

const QuoteGenerator = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Inspirational');
  const [length, setLength] = useState('medium');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Rotate loading instructions for nicer experience
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, tone, length });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
          <FiCpu className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Design Panel</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters for Llama 3.3 to formulate quotes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <FiCompass className="text-brand-500" /> Topic or Keyword
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Perseverance, Tech innovation, Love..."
            className="w-full glass-input"
            disabled={isLoading}
          />
          {/* Quick selection tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  topic === t
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500'
                    : 'bg-slate-100 dark:bg-slate-900 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                disabled={isLoading}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid layout for Tone and Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tone Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <FiSmile className="text-brand-500" /> Voice Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full glass-input"
              disabled={isLoading}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value} className="bg-slate-50 dark:bg-slate-950">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Length Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <FiFeather className="text-brand-500" /> Quote Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((len) => (
                <button
                  key={len.value}
                  type="button"
                  onClick={() => setLength(len.value)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    length === len.value
                      ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/50 bg-slate-50/50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400'
                  }`}
                  disabled={isLoading}
                >
                  <span className="text-sm font-bold">{len.label}</span>
                  <span className={`text-[9px] ${length === len.value ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {len.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full relative overflow-hidden group py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold hover:shadow-xl hover:shadow-brand-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Quote...</span>
              </div>
              <span className="text-[10px] font-medium text-brand-100 animate-pulse">
                {LOADING_STEPS[loadingTextIndex]}
              </span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Formulate Quote <FiCheck className="w-5 h-5" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuoteGenerator;
