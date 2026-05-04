import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/newsSlice';
import favoritesReducer from './features/favoritesSlice';
import preferencesReducer from './features/preferencesSlice';

// 1. Custom middleware to watch for state changes and save to localStorage
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state = store.getState();
  
  if (typeof window !== 'undefined') {
    // Keep your existing favorites logic
    if (action.type?.startsWith('favorites/')) {
      localStorage.setItem('dashboard_favorites', JSON.stringify(state.favorites.articles));
    }
    // Add logic to save preferences
    if (action.type?.startsWith('preferences/')) {
      localStorage.setItem('dashboard_preferences', JSON.stringify(state.preferences));
    }
  }
  return result;
};

// 2. Load the initial state from localStorage when the app starts
const preloadedState = {
  favorites: {
    articles: typeof window !== 'undefined' && localStorage.getItem('dashboard_favorites') 
      ? JSON.parse(localStorage.getItem('dashboard_favorites') as string) 
      : []
  },
  preferences: typeof window !== 'undefined' && localStorage.getItem('dashboard_preferences')
      ? JSON.parse(localStorage.getItem('dashboard_preferences') as string)
      : { categories: ['general'], isDarkMode: false } 
};

// 3. Configure and export the store
export const store = configureStore({
  reducer: {
    news: newsReducer,
    favorites: favoritesReducer,
    preferences: preferencesReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
