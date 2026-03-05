import axios from "axios";
import { cookies } from "next/headers";

const getServerInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });
};

export const fetchNotes = async (params: any) => {
  const instance = await getServerInstance();
  const { data } = await instance.get("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const instance = await getServerInstance();
  const { data } = await instance.get(`/notes/${id}`);
  return data;
};

export const getMe = async () => {
  const instance = await getServerInstance();
  const { data } = await instance.get("/users/me");
  return data;
};

export const checkSession = async () => {
  try {
    const instance = await getServerInstance();
    const { data } = await instance.get("/auth/session");
    return data || null;
  } catch {
    return null;
  }
};