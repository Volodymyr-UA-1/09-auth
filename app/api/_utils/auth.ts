import { cookies } from 'next/headers';

export async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}