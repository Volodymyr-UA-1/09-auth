import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

// AUTH
export const register = async (data: { email: string; password: string }): Promise<User> => {
  const { data: response } = await api.post<User>('/auth/register', data);
  return response;
};

export const login = async (data: { email: string; password: string }): Promise<User> => {
  const { data: response } = await api.post<User>('/auth/login', data);
  return response;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data || null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const { data: response } = await api.patch<User>('/users/me', data);
  return response;
};

// NOTES
export const fetchNotes = (params: FetchNotesParams): Promise<{ notes: Note[]; total: number }> =>
  api.get('/notes', { params }).then(res => res.data);

export const fetchNoteById = (id: string): Promise<Note> =>
  api.get<Note>(`/notes/${id}`).then(res => res.data);

export const createNote = (data: { title: string; content: string; tag: string }): Promise<Note> =>
  api.post<Note>('/notes', data).then(res => res.data);

// ВИПРАВЛЕНО: Тепер повертає Promise<Note> замість Promise<void>
export const deleteNote = (id: string): Promise<Note> =>
  api.delete<Note>(`/notes/${id}`).then(res => res.data);