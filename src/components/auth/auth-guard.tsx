'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

/**
 * Enterprise AuthGuard
 * Protects routes by checking user session and redirecting unauthenticated users.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthRoute = ['/login', '/signup', '/'].includes(pathname);
    
    // If we've finished loading and there's no user, and we're not on an auth page
    if (!loading && !user && !isAuthRoute) {
      router.push('/login');
    }

    // Redirect authenticated users away from login/signup to dashboard
    if (!loading && user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Securely syncing your eco-profile...
          </p>
        </div>
      </div>
    );
  }

  // Handle case where user is not logged in but trying to access protected route
  // (Prevents a brief flash of content before useEffect redirect)
  const isAuthRoute = ['/login', '/signup', '/'].includes(pathname);
  if (!user && !isAuthRoute) {
    return null;
  }

  return <>{children}</>;
}
