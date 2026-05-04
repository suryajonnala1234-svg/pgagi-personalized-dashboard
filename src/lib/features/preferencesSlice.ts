// src/lib/features/preferencesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  categories: string[];
  isDarkMode: boolean;
}

const initialState: PreferencesState = {
  categories: ['general'], // Default category
  isDarkMode: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      if (index >= 0) {
        state.categories.splice(index, 1);
      } else {
        state.categories.push(category);
      }
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setPreferences: (state, action: PayloadAction<PreferencesState>) => {
      return action.payload;
    }
  },
});

export const { toggleCategory, toggleDarkMode, setPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
