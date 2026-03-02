'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api/api'; // або clientApi, якщо ви винесли PATCH туди
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  // Ініціалізуємо стан поточним ім'ям користувача
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Згідно з ТЗ, ми оновлюємо профіль через PATCH /users/me
      const response = await api.patch('/users/me', { username });
      
      // Оновлюємо дані в нашому Zustand сторі
      setUser(response.data);
      
      // Повертаємося на сторінку профілю
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Помилка при оновленні профілю');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        
        <Image
          src={user?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSave} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button 
              type="submit" 
              className={css.saveButton} 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            
            <button 
              type="button" 
              className={css.cancelButton} 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}