import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types';

interface FetchNewsArgs {
  category?: string;
  page?: number;
  query?: string;
}

export const loadNews = createAsyncThunk(
  'news/load', 
  async ({ category = 'general', page = 1, query = '' }: FetchNewsArgs) => {
    const res = await fetch(`/api/news?category=${category}&page=${page}&q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.articles?.filter((a: Article) => a.title && a.urlToImage) || [];
  }
);

interface NewsState {
  articles: Article[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  hasMore: boolean;
}

const initialState: NewsState = { articles: [], status: 'idle', error: null, searchQuery: '', hasMore: true };

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNews.pending, (state, action) => { 
        // Only set loading if it's the latest query
        if ((action.meta.arg.query || '') !== state.searchQuery) return;
        state.status = 'loading'; 
        if (action.meta.arg.page === 1) {
          state.articles = [];
          state.hasMore = true;
        }
      })
      .addCase(loadNews.fulfilled, (state, action) => {
        // Prevent Race Conditions: Ignore out-of-order responses!
        if ((action.meta.arg.query || '') !== state.searchQuery) return;

        state.status = 'succeeded';
        const isFirstPage = action.meta.arg.page === 1 || !action.meta.arg.page;
        
        // If API returns 0 articles, we've reached the end
        if (action.payload.length === 0) {
          state.hasMore = false;
        }
        
        if (isFirstPage) {
          state.articles = action.payload;
        } else {
          // Append new articles, filtering out duplicates
          const existingUrls = new Set(state.articles.map((a: Article) => a.url));
          const newArticles = action.payload.filter((a: Article) => !existingUrls.has(a.url));
          
          if (newArticles.length === 0) {
            // Prevent infinite loop if the API returns the exact same page of results
            state.hasMore = false;
          } else {
            state.articles = [...state.articles, ...newArticles];
          }
        }
      })
      .addCase(loadNews.rejected, (state, action) => {
        if ((action.meta.arg.query || '') !== state.searchQuery) return;
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load';
      });
  },
});

export const { setSearchQuery } = newsSlice.actions;
export default newsSlice.reducer;
