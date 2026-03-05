'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import css from './NotesPage.module.css';

export default function NotesPage() {

  const { data, isLoading, error } = useQuery<{
    notes: Note[];
  }>({
    queryKey: ['notes'],
    queryFn: () => fetchNotes({ perPage: 12, page: 1 })
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (error) return <p>Failed to load notes</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.header}>
        <h1>Notes</h1>

        <Link href="/notes/create" className={css.createButton}>
          Create Note
        </Link>
      </div>

      <ul className={css.notesList}>
        {data?.notes?.map(note => (
          <li key={note.id} className={css.noteItem}>
            <Link href={`/notes/${note.id}`}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <span className={css.tag}>{note.tag}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}