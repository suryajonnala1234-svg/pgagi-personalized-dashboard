'use client';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { useAppSelector } from '../lib/hooks';
import { useEffect } from 'react';

// This component runs inside the Provider to sync Redux state to the DOM
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const isDarkMode = useAppSelector(state => state.preferences.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeInitializer>
        {children}
      </ThemeInitializer>
    </Provider>
  );
}
