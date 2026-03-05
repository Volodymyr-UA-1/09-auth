'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce"; // 1. Імпортуємо дебаунс
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import EmptyState from "@/components/EmptyState/EmptyState";
import SearchBox from "@/components/SearchBox/SearchBox";

import { fetchNotes } from "@/lib/api/clientApi";
import css from "./Notes.client.module.css";

const perPage = 12;
const VALID_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface Props {
  initialTag: string;
}

export default function NotesClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // 2. Створюємо дебаунс-значення (затримка 500мс)
  const [debouncedSearch] = useDebounce(search, 500);

  // Скидаємо фільтри при зміні тегу
  useEffect(() => {
    setPage(1);
    setSearch("");
  }, [initialTag]);

  const activeTag = VALID_TAGS.includes(initialTag) ? initialTag : "";

  const { data, isLoading, isError, isFetching } = useQuery({
    // 3. Використовуємо debouncedSearch у ключі та функції
    queryKey: ["notes", initialTag, page, debouncedSearch],

    queryFn: () =>
      fetchNotes({
        tag: activeTag,
        page,
        perPage,
        search: debouncedSearch,
      }),

    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (!data) return;
    // Припускаємо, що API повертає totalPages
    if (newPage >= 1 && newPage <= (data as any).totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value); // Стан інпуту оновлюється миттєво для відображення букв
    setPage(1);       // Але запит піде тільки через 500мс завдяки debouncedSearch
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} initialValue={search} />

        {data && (data as any).totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={(data as any).totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* 4. ВИПРАВЛЕНО: Правильний шлях для створення нотатки */}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}

      {!isLoading && !isError && data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {isFetching && <div className={css.fetchingLoader}>Updating...</div>}
        </>
      )}

      {!isLoading && !isError && data && data.notes.length === 0 && (
        <EmptyState
          message={
            search
              ? "No notes match your search"
              : "No notes in this category"
          }
        />
      )}
    </div>
  );
}