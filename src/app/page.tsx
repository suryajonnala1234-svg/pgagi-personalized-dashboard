'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer'; 
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { loadNews } from '../lib/features/newsSlice';
import NewsCard from '../components/cards/NewsCard';
import { Article } from '../lib/types';
import { motion } from 'framer-motion';
import SocialCard from '../components/cards/SocialCard'; 
import RecommendationCard from '../components/cards/RecommendationCard'; // <-- Import RecommendationCard

const CATEGORIES = ['general', 'technology', 'business', 'entertainment', 'sports', 'science'];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { articles, status, searchQuery, hasMore } = useAppSelector(s => s.news);
  const [activeCategory, setActiveCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [socialPosts, setSocialPosts] = useState<any[]>([]); 
  const [recommendations, setRecommendations] = useState<any[]>([]); // Track recommendations

  const { ref, inView } = useInView({
    threshold: 0, 
  });

  // Fetch mock data on mount
  useEffect(() => {
    fetch('/api/social')
      .then(res => res.json())
      .then(data => setSocialPosts(data.posts))
      .catch(console.error);

    fetch(`/api/recommendations?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => setRecommendations(data.posts.filter((p: any) => p.type === 'movie')))
      .catch(console.error);
  }, []);

  // Fetch recommendations whenever category changes (Personalized based on preference!)
  useEffect(() => {
    fetch(`/api/recommendations?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => setRecommendations(data.posts.filter((p: any) => p.type === 'movie')))
      .catch(console.error);
  }, [activeCategory]);

  // Reset and load first page when category or search changes
  useEffect(() => {
    setPage(1);
    dispatch(loadNews({ category: activeCategory, page: 1, query: searchQuery }));
  }, [dispatch, activeCategory, searchQuery]);

  // Infinite Scroll Hook
  useEffect(() => {
    if (inView && status === 'succeeded' && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(loadNews({ category: activeCategory, page: nextPage, query: searchQuery }));
    }
  }, [inView, status, activeCategory, dispatch, page, searchQuery, hasMore]);

  // Construct a Unified Feed
  const unifiedFeed: React.ReactNode[] = [];

  // 1. Inject the personalized recommendation AT THE VERY TOP (Independent of News Articles)
  if (recommendations.length > 0) {
    const rec = recommendations[0];
    unifiedFeed.push(
      <motion.div 
        key={`rec-top-${rec.id}`} 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="md:col-span-2 xl:col-span-3 mb-4"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-1 shadow-xl shadow-purple-500/20">
          <RecommendationCard item={rec} />
        </div>
      </motion.div>
    );
  }

  articles.forEach((article, i) => {

    // 2. Add the news article
    unifiedFeed.push(
      <motion.div key={`news-${article.url}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <NewsCard article={article} />
      </motion.div>
    );
    
    // 3. Inject a social post after every 4 articles
    if ((i + 1) % 4 === 0 && socialPosts.length > 0) {
      const socialIndex = Math.floor(i / 4) % socialPosts.length;
      const post = socialPosts[socialIndex];
      unifiedFeed.push(
        <motion.div key={`social-${post.id}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SocialCard post={post} />
        </motion.div>
      );
    }
  });

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        Your Personalized Feed
      </h2>
      <p className="text-[var(--text-secondary)] mb-6">Discover stories tailored to your interests.</p>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all duration-200 ${
              activeCategory === cat 
                ? 'bg-blue-500 text-white shadow-md scale-105' 
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-300 text-[var(--text-secondary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Unified Feed Grid or Loading State */}
      {status === 'loading' && page === 1 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {unifiedFeed.length > 0 ? unifiedFeed : (
            <div className="col-span-full text-center py-12 text-gray-500 text-lg">
              No results found. Try a different search!
            </div>
          )}
        </div>
      )}

      {/* Infinite Scroll Observer */}
      {hasMore && unifiedFeed.length > 0 && (
        <div ref={ref} className="h-10 w-full mt-4 flex justify-center py-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          )}
        </div>
      )}
    </div>
  );
}
