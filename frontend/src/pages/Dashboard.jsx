import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QuoteGenerator from '../components/QuoteGenerator';
import StatsDashboard from '../components/StatsDashboard';
import QuoteCard from '../components/QuoteCard';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

const Dashboard = () => {
  const { user, refreshStats } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Fetch stats and profile details on load
  useEffect(() => {
    refreshStats();
  }, []);

  const handleGenerate = async (params) => {
    try {
      setGenerating(true);
      setCurrentQuote(null);
      const res = await axios.post('/api/quotes/generate', params);
      
      if (res.data && res.data.success) {
        setCurrentQuote(res.data.data);
        toast.success('AI successfully formulated a new quote!');
        // Refresh profile stats
        refreshStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate quote');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await axios.patch(`/api/quotes/${id}/favorite`);
      if (res.data && res.data.success) {
        const updated = res.data.data;
        if (currentQuote && currentQuote._id === id) {
          setCurrentQuote(updated);
        }
        toast.success(updated.isFavorite ? 'Saved to favorites' : 'Removed from favorites');
        refreshStats();
      }
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">{user?.username}</span>!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Formulate premium context-specific quotes using Llama 3.3-70B.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      {user?.stats && (
        <section>
          <StatsDashboard stats={user.stats} />
        </section>
      )}

      {/* Main Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Form */}
        <div className="lg:col-span-5">
          <QuoteGenerator onGenerate={handleGenerate} isLoading={generating} />
        </div>

        {/* Display Generated Quote */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Generated Result
          </h3>
          
          <div className="min-h-[220px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50/20 dark:bg-slate-900/5 transition-all">
            <AnimatePresence mode="wait">
              {currentQuote ? (
                <div className="w-full">
                  <QuoteCard
                    quote={currentQuote}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ) : generating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Llama AI is writing...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-sm"
                >
                  <span className="text-4xl">💡</span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3">Select your specifications and click Formulate Quote</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your newly generated quote will appear here instantly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
