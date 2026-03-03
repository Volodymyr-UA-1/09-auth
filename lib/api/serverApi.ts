import axios from 'axios';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

const SERVER_URL = 'https://notehub-public.goit.study/api';

// Експортуємо axiosInstance для proxy (виправляє помилку image_629563.jpg)
export const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

const getServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  return axios.create({
    baseURL: SERVER_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

export const fetchNotes = async (params: any) => {
  try {
    const api = await getServerApi();
    const { data } = await api.get('/notes', { params });
    return data;
  } catch (error) {
    return { notes: [], totalPages: 0 };
  }
};

// Повертаємо повний response для proxy (виправляє помилку image_62965e.jpg)
export const checkSession = async () => {
  try {
    const api = await getServerApi();
    return await api.get('/auth/session');
  } catch {
    return null;
  }
};