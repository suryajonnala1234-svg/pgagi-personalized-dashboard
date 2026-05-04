import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types';

interface FavoritesState {
  articles: Article[];
}

const initialState: FavoritesState = { articles: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Article>) => {
      const idx = state.articles.findIndex((a) => a.url === action.payload.url);
      if (idx >= 0) state.articles.splice(idx, 1);
      else state.articles.push(action.payload);
    },
    reorderFavorites: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
  },
});

export const { toggleFavorite, reorderFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
