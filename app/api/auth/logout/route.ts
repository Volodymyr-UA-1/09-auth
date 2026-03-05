import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      // Бекенд вимагає Bearer токен для виходу
      await api.post('/auth/logout', null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    }
  } finally {
    // Куки видаляємо у будь-якому випадку, щоб користувач вийшов локально
    const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}