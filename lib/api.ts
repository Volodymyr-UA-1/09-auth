
import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

// 1. Звертаємося до твого ВЛАСНОГО API (Route Handlers)
// Це автоматично вирішить проблему з токенами, бо ми дістаємо їх із кук на сервері
const api = axios.create({
  baseURL: "/api", 
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

// 2. Отримання нотатки за ID
// Використовується на сторінці детального перегляду
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

// 3. Створити нову нотатку
export const createNote = async (
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  // Твій Route Handler у /api/notes/route.ts додасть Bearer токен
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
};

// 4. Видалити нотатку за ID
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

// 5. Отримання списку нотаток з фільтрами
export const fetchNotes = async ({
  search = "",
  page = 1,
  perPage = 12,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  
  const queryParams: any = {
    search,
    page,
    perPage,
  };

  // Логіка для тегів (ігноруємо "all" або "All", щоб отримати всі нотатки)
  if (tag && tag.toLowerCase() !== "all") {
    queryParams.tag = tag;
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: queryParams,
  });

  return data;
};

export type NewNoteData = {
  title: string;
  content: string;
  tag: NoteTag;
};