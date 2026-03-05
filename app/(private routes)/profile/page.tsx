'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';
import css from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  // Sync with backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const freshUser = await getMe();
        setUser(freshUser);
      } catch {}
    };

    loadUser();
  }, []);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
      </div>
    </main>
  );
}