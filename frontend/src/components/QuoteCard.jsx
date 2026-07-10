import React, { useState } from 'react';
import { FiCopy, FiShare2, FiDownload, FiHeart, FiTrash2, FiCalendar, FiTag, FiVolume2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const QuoteCard = ({ quote, onToggleFavorite, onDelete }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
      setIsCopied(true);
      toast.success('Quote copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  // Text-To-Speech Reader
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(`"${quote.text}" by ${quote.author}`);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in this browser.');
    }
  };

  // Web Share API
  const handleShare = async () => {
    const textStr = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'InspirAI Quote',
          text: textStr,
          url: window.location.origin
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Error sharing quote');
        }
      }
    } else {
      // Fallback
      handleCopy();
      toast.info('Sharing URL copied since web share is unsupported.');
    }
  };

  // Render Quote to SVG and download
  const handleDownload = () => {
    try {
      const width = 800;
      const height = 450;
      
      // Multi-line wrap logic for SVG text
      const maxCharsPerLine = 38;
      const words = quote.text.split(' ');
      const lines = [];
      let currentLine = '';

      words.forEach(word => {
        if ((currentLine + word).length > maxCharsPerLine) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      if (currentLine) lines.push(currentLine.trim());

      // Center layout coordinates
      const textStartY = height / 2 - (lines.length * 18) - 10;

      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#4f46e5;stop-opacity:1" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="4" flood-opacity="0.3"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          
          <!-- Background decoration -->
          <circle cx="100" cy="100" r="150" fill="white" opacity="0.05" />
          <circle cx="700" cy="350" r="180" fill="white" opacity="0.05" />
          
          <!-- Watermark Logo -->
          <text x="40" y="50" font-family="'Outfit', sans-serif" font-weight="800" font-size="20" fill="white" opacity="0.7">✨ InspirAI</text>
          
          <!-- Quote Icon -->
          <text x="400" y="${textStartY - 30}" font-family="Georgia, serif" font-size="80" fill="white" opacity="0.25" text-anchor="middle">“</text>
          
          <!-- Quote Body -->
          ${lines.map((line, idx) => `
            <text x="400" y="${textStartY + (idx * 38)}" font-family="'Outfit', sans-serif" font-weight="600" font-size="24" fill="white" text-anchor="middle" filter="url(#shadow)">
              ${line}
            </text>
          `).join('')}
          
          <!-- Author -->
          <text x="400" y="${textStartY + (lines.length * 38) + 40}" font-family="'Inter', sans-serif" font-size="18" fill="#e9d5ff" font-style="italic" text-anchor="middle" opacity="0.9">
            — ${quote.author}
          </text>
          
          <!-- Footer Branding -->
          <text x="400" y="410" font-family="'Inter', sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.5">
            Generated with InspirAI
          </text>
        </svg>
      `.trim();

      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `quote-${quote.topic}-${quote._id.substring(0, 5)}.svg`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Beautiful SVG quote template downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download image');
    }
  };

  const formattedDate = new Date(quote.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-brand-500/30 group"
    >
      {/* Visual Accent Gradient Spot */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 dark:bg-brand-500/5 blur-2xl rounded-full pointer-events-none group-hover:scale-150 transition-all duration-500"></div>

      {/* Card Header Tags */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-900/30">
            <FiTag className="w-3 h-3" /> {quote.topic}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
            {quote.tone}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <FiCalendar className="w-3.5 h-3.5" /> {formattedDate}
        </span>
      </div>

      {/* Quote Body */}
      <div className="flex-grow mb-6 relative">
        {/* Double Quotes Watermark */}
        <span className="absolute -top-6 -left-2 text-7xl font-serif text-slate-200/50 dark:text-slate-800/40 select-none pointer-events-none">
          “
        </span>
        <blockquote className="text-lg sm:text-xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100 relative z-10 pl-4 italic">
          {quote.text}
        </blockquote>
        <cite className="block text-right text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mt-4 not-italic">
          — {quote.author}
        </cite>
      </div>

      {/* Actions Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isCopied ? 'text-green-500 dark:text-green-400' : ''}`}
            title="Copy quote"
          >
            <FiCopy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isSpeaking ? 'text-brand-500 dark:text-brand-400 animate-pulse' : ''}`}
            title="Read Quote Aloud"
          >
            <FiVolume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share quote"
          >
            <FiShare2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Download quote template"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onToggleFavorite(quote._id)}
            className={`p-2.5 rounded-xl transition-all duration-300 border ${
              quote.isFavorite
                ? 'bg-rose-50 border-rose-100 dark:border-rose-950/20 text-rose-500 dark:bg-rose-950/30'
                : 'text-slate-400 dark:text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={quote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart className={`w-4 h-4 ${quote.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(quote._id)}
              className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-transparent"
              title="Delete quote"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteCard;
