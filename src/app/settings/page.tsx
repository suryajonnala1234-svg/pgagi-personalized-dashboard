'use client';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleDarkMode } from '../../lib/features/preferencesSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(state => state.preferences.isDarkMode);

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Preferences</h2>
      
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800 dark:text-gray-200">Dark Mode</span>
        <button 
          onClick={toggleTheme}
          className={`w-14 h-7 rounded-full transition-colors ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
}
