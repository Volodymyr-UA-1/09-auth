'use client';

import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api/clientApi';
import { NoteTag } from '@/types/note';
import css from './CreateNote.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

export default function CreateNotePage() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote(draft);
      clearDraft(); // Очищаємо чернетку після успішного створення
      router.push('/notes'); // Повертаємося до списку нотаток
      router.refresh(); // Оновлюємо дані на сервері
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Помилка при створенні нотатки');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.title}>Create New Note</h1>
      
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={draft.title}
            onChange={handleChange}
            required
            className={css.input}
          />
        </div>

        <div className={css.field}>
          <label htmlFor="tag">Category</label>
          <select
            id="tag"
            name="tag"
            value={draft.tag}
            onChange={handleChange}
            className={css.select}
          >
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className={css.field}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            value={draft.content}
            onChange={handleChange}
            required
            className={css.textarea}
          />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={() => router.back()} className={css.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={css.submitBtn}>
            Create Note
          </button>
        </div>
      </form>
    </main>
  );
}