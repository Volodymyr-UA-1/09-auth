'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api/api'; 
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Синхронізація інпуту при першому завантаженні (F5)
  useEffect(() => {
    if (user?.username && !username) {
      setUsername(user.username);
    }
  }, [user, username]);

  // ЛОГІКА ЗБЕРЕЖЕННЯ (Save)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === user?.username) return;

    setIsSubmitting(true);
    try {
      // Відправляємо запит на бекенд
      const response = await api.patch('/users/me', { username });
      
      // Оновлюємо глобальний стан користувача
      setUser(response.data);
      
      // Автоматичний редірект на профіль
      router.push('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Помилка при оновленні профілю');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ЛОГІКА СКАСУВАННЯ (Cancel)
  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            unoptimized
          />
        </div>

        <form onSubmit={handleSave} className={css.profileInfo}>
          <div className={css.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={css.emailGroup}>
            <p>Email (cannot be changed): <strong>{user?.email}</strong></p>
          </div>

          <div className={css.actions}>
            <button 
              type="submit" 
              className={css.saveButton} 
              disabled={isSubmitting || username === user?.username}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            
            <button 
              type="button" 
              className={css.cancelButton} 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}