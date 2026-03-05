'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Modal from '@/components/Modal/Modal';
import css from './NotePreview.client.module.css';
// ВИПРАВЛЕНО: Використовуємо clientApi для клієнтського компонента
import { fetchNoteById } from '@/lib/api/clientApi';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();
  const handleClose = () => router.back();

  const { data: note, isLoading, isError } = useQuery({
    // Ключ має бути ідентичним тому, що ми використовували в NoteDetails
    // Це дозволяє Next.js підхопити дані, якщо вони вже були в кеші
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    staleTime: 60 * 1000, // Дані вважаються свіжими протягом 1 хвилини
  });

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <div className={css.loading}>Loading...</div>}
        
        {isError && <div className={css.error}>Failed to load note data.</div>}

        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2 className={css.title}>{note.title}</h2>
              <button className={css.backBtn} onClick={handleClose}>
                Close
              </button>
            </div>
            <div className={css.content}>{note.content}</div>
            <div className={css.footer}>
              <div className={css.tag}>{note.tag}</div>
              <div className={css.date}>
                {/* Безпечна обробка дати */}
                {note.createdAt 
                  ? new Date(note.createdAt).toLocaleDateString() 
                  : 'No date'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}