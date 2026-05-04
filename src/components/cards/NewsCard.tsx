'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../../lib/types';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleFavorite } from '../../lib/features/favoritesSlice';
import { Sparkles, Bookmark, ExternalLink, Activity, Volume2, VolumeX } from 'lucide-react';

export default function NewsCard({ article, dragHandle }: { article: Article, dragHandle?: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(s => s.favorites.articles.some(a => a.url === article.url));
  
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // 1. AI Summary & Sentiment Logic
  const handleAI = async (type: 'summarize' | 'sentiment') => {
    if (!article.description && !article.content) return;
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: article.description || article.content, type })
      });
      const data = await res.json();
      if (type === 'summarize') setSummary(data.result);
      if (type === 'sentiment') setSentiment(data.result);
    } catch (error) {
      console.error(error);
    }
    setLoadingAI(false);
  };

  // 2. Voice Read (Text-to-Speech) Logic
  const toggleVoice = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const textToRead = summary || article.description || article.title;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }} 
      className="premium-card rounded-2xl overflow-hidden relative flex flex-col h-full"
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800 shrink-0">
        {dragHandle && <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur rounded p-1 cursor-grab shadow">{dragHandle}</div>}
        <img src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'} alt="news" className="w-full h-full object-cover" />
        
        {/* Sentiment Badge on the Image */}
        {sentiment && (
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur text-white text-xs font-bold rounded-full border border-white/20 shadow-lg flex items-center gap-1">
            <Activity size={12} /> {sentiment}
          </div>
        )}

        <button 
          onClick={() => dispatch(toggleFavorite(article))}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-all ${isSaved ? 'bg-blue-500 text-white' : 'bg-white/70 hover:bg-white text-gray-800'}`}
        >
          <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug">{article.title}</h3>
        
        {summary ? (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <Sparkles size={16} className="shrink-0 mt-0.5" />
              {summary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">{article.description}</p>
        )}

        {/* Action Buttons Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 transition-colors flex items-center gap-1 shrink-0"
            >
              <ExternalLink size={14} /> Read More
            </a>

            <button 
              onClick={() => handleAI('summarize')}
              disabled={loadingAI || !!summary}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 transition-colors flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              <Sparkles size={14} /> Summary
            </button>
            
            <button 
              onClick={() => handleAI('sentiment')}
              disabled={loadingAI || !!sentiment}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              <Activity size={14} /> Sentiment
            </button>
          </div>

          <button 
            onClick={toggleVoice}
            className="text-xs font-semibold p-2 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 transition-colors flex items-center justify-center shrink-0"
            title="Read Aloud"
          >
            {isReading ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
