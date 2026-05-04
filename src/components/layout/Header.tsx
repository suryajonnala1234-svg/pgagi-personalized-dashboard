'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { useAppDispatch } from '../../lib/hooks';
import { setSearchQuery } from '../../lib/features/newsSlice';
import { useSession, signIn, signOut } from 'next-auth/react';

// 1. Export the Sidebar component
export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800 min-h-screen p-4 flex flex-col gap-4">
      <h1 className="font-bold text-2xl text-blue-500 mb-8 px-2">ContentHub</h1>
      <Link href="/" className="hover:text-blue-500 font-semibold px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Dashboard</Link>
      <Link href="/trending" className="hover:text-blue-500 font-semibold px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Trending</Link>
      <Link href="/favorites" className="hover:text-blue-500 font-semibold px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Favorites</Link>
      <Link href="/settings" className="hover:text-blue-500 font-semibold px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Settings</Link>
    </aside>
  );
}

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear the previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to dispatch the search query after user stops typing
    timeoutRef.current = setTimeout(() => {
      dispatch(setSearchQuery(value));
    }, 800); // 800ms delay gives plenty of time for typing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // User pressed Enter. Trigger the search immediately!
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(setSearchQuery(searchTerm));
    }
  };

  return (
    <header className="h-16 border-b dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <input 
        suppressHydrationWarning={true} 
        type="text" 
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search news... (Press Enter to search instantly)" 
        className="border dark:border-gray-700 rounded-lg px-4 py-2 w-96 outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors" 
      />

      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </Link>
        <div 
          onClick={() => status === 'authenticated' ? signOut() : signIn()}
          className="flex items-center gap-3 border-l dark:border-gray-700 pl-4 group cursor-pointer"
        >
          <div className="text-sm text-right hidden sm:block">
            <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {status === 'loading' ? 'Loading...' : (session?.user?.name || 'Guest User')}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              {status === 'authenticated' ? 'Click to Sign Out' : 'Not logged in'}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              (session?.user?.name?.[0] || 'G').toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
