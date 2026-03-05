'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, logout } from '@/lib/api/clientApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const { user, setUser, clearIsAuthenticated } = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  const isCheckingRef = useRef(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.replace('/sign-in');
    }
  }, [clearIsAuthenticated, router]);

  useEffect(() => {
    const initAuth = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const userData = await checkSession();

        if (userData) {
          setUser(userData);

          if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            router.replace('/profile');
          }
        } else {
          if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
            await handleLogout();
          }
        }
      } catch {
        if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
          await handleLogout();
        }
      } finally {
        setIsLoading(false);
        isCheckingRef.current = false;
      }
    };

    initAuth();
  }, [pathname, router, setUser, handleLogout]);

  useEffect(() => {
    if (isLoading) return;

    const isPrivate = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    if (isPrivate && !user) {
      router.replace('/sign-in');
    }

    if (isAuthRoute && user) {
      router.replace('/profile');
    }
  }, [pathname, user, isLoading, router]);

  if (isLoading) return null;

  return <>{children}</>;
}