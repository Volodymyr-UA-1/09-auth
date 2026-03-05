'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import EmptyState from "@/components/EmptyState/EmptyState";
import SearchBox from "@/components/SearchBox/SearchBox";

import { fetchNotes } from "@/lib/api/clientApi";
import { Note } from "@/types/note";

import css from "./Notes.client.module.css";

const perPage = 12;
const VALID_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface Props {
  initialTag: string;
}

export default function NotesClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Reset filters when tag changes
  useEffect(() => {
    setPage(1);
    setSearch("");
  }, [initialTag]);

  const activeTag = VALID_TAGS.includes(initialTag) ? initialTag : "";

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", initialTag, page, search],

    queryFn: () =>
      fetchNotes({
        tag: activeTag,
        page,
        perPage,
        search,
      }),

    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    if (!data) return;

    if (newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} initialValue={search} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/create" className={css.button}>
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