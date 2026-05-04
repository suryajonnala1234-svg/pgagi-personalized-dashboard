'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { loadNews } from '../../lib/features/newsSlice';
import NewsCard from '../../components/cards/NewsCard';
import SocialCard from '../../components/cards/SocialCard';
import RecommendationCard from '../../components/cards/RecommendationCard';
import { Article } from '../../lib/types';

export default function TrendingPage() {
  const dispatch = useAppDispatch();
  const { articles, status } = useAppSelector((s) => s.news);
  
  const [movies, setMovies] = useState<any[]>([]);
  const [social, setSocial] = useState<any[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    // Fetch a different category for "Trending News"
    dispatch(loadNews({ category: 'technology', page: 1 })); 
    
    // Fetch Trending Movies & Social
    Promise.all([
      fetch('/api/recommendations?category=popular').then(res => res.json()),
      fetch('/api/social').then(res => res.json())
    ]).then(([moviesData, socialData]) => {
      setMovies(moviesData.posts || []);
      setSocial(socialData.posts || []);
      setLoadingExtras(false);
    }).catch(console.error);
    
  }, [dispatch]);

  if (status === 'loading' && loadingExtras) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2">
          🎬 Trending Movies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {movies.slice(0, 3).map((movie, i) => (
            <RecommendationCard key={`movie-${i}`} item={movie} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2">
          📰 Trending News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article: Article, i: number) => (
            <NewsCard key={`news-${i}`} article={article} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2">
          💬 Trending Social Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {social.map((post, i) => (
            <SocialCard key={`social-${i}`} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
