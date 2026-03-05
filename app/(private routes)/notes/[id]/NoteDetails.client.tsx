'use client';

import { useQuery } from '@tanstack/react-query';
import css from './NoteDetails.module.css';
import EmptyState from '@/components/EmptyState/EmptyState';
import { notFound } from 'next/navigation';
// ВИПРАВЛЕНО: Імпортуємо саме з clientApi для роботи у браузері
import { fetchNoteById } from '@/lib/api/clientApi';

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  
  // Перевірка на "create" для уникнення некоректних запитів
  if (id === "create") {
    notFound();
  }

  const { data: note, isLoading, error } = useQuery({
    // Ключ має збігатися з ключем для prefetchQuery на сервері
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    // refetchOnMount: false дозволяє використовувати дані, 
    // завантажені сервером (hydration), без повторного запиту
    refetchOnMount: false,
    staleTime: 60 * 1000,
  });

  if (isLoading) return <p className={css.loading}>Loading...</p>;

  if (error || !note) {
    const message = error instanceof Error ? error.message : 'Note not found';
    return <EmptyState message={message} />;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <p className={css.date}>
            {/* Використовуємо optional chaining для безпеки */}
            {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Date unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}