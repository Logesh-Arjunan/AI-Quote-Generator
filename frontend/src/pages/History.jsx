import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuoteCard from '../components/QuoteCard';
import { toast } from 'react-toastify';
import { FiSearch, FiSliders, FiTrash2, FiFileText } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const History = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');

  // Extract unique topics/tones from quotes to fill filters dynamically
  const [availableTopics, setAvailableTopics] = useState([]);
  const [availableTones, setAvailableTones] = useState([]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (topic) params.topic = topic;
      if (tone) params.tone = tone;

      const res = await axios.get('/api/quotes', { params });
      if (res.data && res.data.success) {
        setQuotes(res.data.data);

        // Populate filter options only if initial load
        if (!topic && !tone && !search) {
          const topicsSet = new Set(res.data.data.map(q => q.topic));
          const tonesSet = new Set(res.data.data.map(q => q.tone));
          setAvailableTopics([...topicsSet]);
          setAvailableTones([...tonesSet]);
        }
      }
    } catch (err) {
      toast.error('Failed to load quote history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [search, topic, tone]);

  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(`/api/quotes/${id}/favorite`);
      if (res.data && res.data.success) {
        const updated = res.data.data;
        setQuotes(prev =>
          prev.map(q => (q._id === id ? { ...q, isFavorite: updated.isFavorite } : q))
        );
        toast.success(updated.isFavorite ? 'Saved to favorites' : 'Removed from favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    try {
      const res = await axios.delete(`/api/quotes/${id}`);
      if (res.data && res.data.success) {
        setQuotes(prev => prev.filter(q => q._id !== id));
        toast.success('Quote deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete quote');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Generation History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, search, and manage all quotes formulated by InspirAI.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes, keywords, or authors..."
            className="w-full pl-11 pr-4 py-3 glass-input"
          />
        </div>

        {/* Topic filter */}
        <div className="md:col-span-3">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full glass-input"
          >
            <option value="">All Topics</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Tone filter */}
        <div className="md:col-span-3">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full glass-input"
          >
            <option value="">All Tones</option>
            {availableTones.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state / Grid list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Retrieving history log...</span>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <FiFileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No quotes found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Try adjusting your search criteria or formulate a new quote.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {quotes.map((q) => (
              <QuoteCard
                key={q._id}
                quote={q}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default History;
