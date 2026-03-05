import { Metadata } from 'next'; // Імпорт типу Metadata
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi'; // ВИПРАВЛЕНО: Використовуємо серверний API
import css from './ProfilePage.module.css';

// 1. Додаємо метадані (вимога завдання)
export const metadata: Metadata = {
  title: 'Profile | My App',
  description: 'User profile page',
};

// 2. Компонент тепер асинхронний серверний компонент
export default async function ProfilePage() {
  // 3. Отримуємо дані безпосередньо на сервері
  let user = null;
  try {
    user = await getMe();
  } catch (error) {
    // У разі помилки можна редиректити або показати повідомлення
    console.error("Failed to fetch user:", error);
  }

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
            <strong>Username:</strong> {user?.username || 'Guest'}
          </p>

          <p>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>
      </div>
    </main>
  );
}