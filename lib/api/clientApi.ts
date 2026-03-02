import { api } from './api';
import { User } from '@/types/user';
import { Note, NoteTag } from '@/types/note';

// Типи для нотаток (можна винести в types/note.ts)
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

// AUTH FUNCTIONS
export const register = async (data: any): Promise<User> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const login = async (data: any): Promise<User> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const res = await api.get('/auth/session');
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const res = await api.patch('/users/me', data);
  return res.data;
};

// NOTES FUNCTIONS
export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (noteData: { title: string; content: string; tag: NoteTag }): Promise<Note> => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};