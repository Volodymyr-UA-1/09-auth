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
export const register = async (data: { email: string; password: string }) => {
  const { data: response } = await api.post<User>('/auth/register', data);
  return response;
};

export const login = async (data: { email: string; password: string }) => {
  const { data: response } = await api.post<User>('/auth/login', data);
  return response;
};

export const logout = async () => {
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

export const updateMe = async (data: { username: string }) => {
  const { data: response } = await api.patch('/users/me', data);
  return response;
};

// NOTES
export const fetchNotes = (params: FetchNotesParams) =>
  api.get('/notes', { params }).then(res => res.data);

export const fetchNoteById = (id: string) =>
  api.get<Note>(`/notes/${id}`).then(res => res.data);

export const createNote = (data: Partial<Note>) =>
  api.post('/notes', data).then(res => res.data);

export const deleteNote = (id: string) =>
  api.delete(`/notes/${id}`).then(res => res.data);