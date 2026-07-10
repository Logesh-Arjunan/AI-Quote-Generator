import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuoteCard from '../components/QuoteCard';
import { toast } from 'react-toastify';
import { FiSearch, FiHeart, FiStar } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const Favorites = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const params = { isFavorite: 'true' };
      if (search) params.search = search;

      const res = await axios.get('/api/quotes', { params });
      if (res.data && res.data.success) {
        setQuotes(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [search]);

  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(`/api/quotes/${id}/favorite`);
      if (res.data && res.data.success) {
        const updated = res.data.data;
        if (!updated.isFavorite) {
          // Remove from favorites layout list immediately
          setQuotes(prev => prev.filter(q => q._id !== id));
          toast.info('Removed from favorites');
        }
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Saved Favorites <FiStar className="text-amber-500 fill-current w-8 h-8" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Access your handpicked collection of inspiring quotes.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-5 relative">
        <FiSearch className="absolute left-9 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search favorite quotes, authors..."
          className="w-full pl-12 pr-4 py-3.5 glass-input"
        />
      </div>

      {/* Loading state / Grid list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Opening vault...</span>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <FiHeart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No favorites found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Browse history and heart quotes to save them here.
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

export default Favorites;
