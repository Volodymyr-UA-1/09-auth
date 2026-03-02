'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, logout } from '@/lib/api/clientApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
          // Якщо сесії немає на приватному маршруті
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

    const handleLogout = async () => {
      await logout();
      clearIsAuthenticated();
      router.push('/sign-in');
    };

    initAuth();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (isLoading) {
    return <div className="loader">Loading...</div>; // Можна замінити на гарний Spinner
  }

  return <>{children}</>;
}