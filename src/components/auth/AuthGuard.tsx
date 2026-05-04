'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../../lib/hooks';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, mounted]);

  // Don't render until hydration is complete to prevent mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-950"></div>;
  }

  // If not authenticated and trying to access a protected route, show nothing while redirecting
  if (!isAuthenticated && pathname !== '/login') {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return <>{children}</>;
}
