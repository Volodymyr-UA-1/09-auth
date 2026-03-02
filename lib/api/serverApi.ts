import axios from 'axios';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

// Пряма адреса бекенду GoIT для сервера
const SERVER_URL = 'https://notehub-public.goit.study/api';

const getServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return axios.create({
    baseURL: SERVER_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchNotes = async (params: any) => {
  const api = await getServerApi();
  const { data } = await api.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = await getServerApi();
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const api = await getServerApi();
  const res = await api.get('/users/me');
  return res.data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    return await getMe();
  } catch {
    return null;
  }
};