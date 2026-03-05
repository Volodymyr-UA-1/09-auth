'use client'; // 1. Перетворюємо компонент на клієнтський

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 2. Імпорт правильного хука

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 3. Викликаємо оновлення маршрутів при монтуванні
    router.refresh();
  }, [router]);

  return (
    <div className="auth-container">
      {children}
    </div>
  );
}