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
  const initialized = useRef(false); // Захист від подвійного виклику в StrictMode

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
    }
  }, [clearIsAuthenticated, router]);

  useEffect(() => {
    const initAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        const userData = await checkSession();
        if (userData) {
          setUser(userData);
        } else if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
          await handleLogout();
        }
      } catch (error) {
        if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
          await handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, handleLogout]); // Видалено pathname з залежностей

  // Окремий ефект для редіректів при зміні шляху, якщо юзер не авторизований
  useEffect(() => {
    if (!isLoading) {
      const isPrivate = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
      const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

      if (isPrivate && !user) {
        router.push('/sign-in');
      } else if (isAuthRoute && user) {
        router.push('/notes/filter/all');
      }
    }
  }, [pathname, user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}