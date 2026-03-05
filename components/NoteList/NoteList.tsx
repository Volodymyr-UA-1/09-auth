'use client';
import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";
import type { Note } from "../../types/note";
import Link from "next/link"; // 1. ВИПРАВЛЕНО: Імпорт Link
import EmptyState from "../EmptyState/EmptyState";
import { deleteNote } from "@/lib/api/clientApi";


interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onMutate: (id: string) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
    onSettled: () => setDeletingId(null),
  });

  if (!notes || notes.length === 0) return <EmptyState />;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              
              {/* 2. ВИПРАВЛЕНО: Заміна кнопки з router.push на Link */}
              <Link 
                href={`/notes/${note.id}`} 
                className={css.detailsLink}
              >
                View Details
              </Link>

              <button
                className={css.button}
                onClick={() => {
                  if (confirm("Ви впевнені?")) mutate(note.id);
                }}
                disabled={deletingId === note.id}
              >
                {deletingId === note.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}