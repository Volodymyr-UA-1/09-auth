
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

/**
 * Перевіряє, чи pathname відповідає заданим маршрутам або їх підмаршрутам
 * Це запобігає помилковим збігам (наприклад, /profiled не пройде для /profile)
 */
const matchesRoute = (pathname: string, routes: string[]) => {
  return routes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // 1. ЛОГІКА ДЛЯ МАРШРУТІВ АВТЕНТИФІКАЦІЇ (Public Auth Routes)
  if (isAuthRoute) {
    if (accessToken) {
      // Якщо користувач вже в системі, перенаправляємо на головну
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Дозволяємо доступ неавторизованим користувачам
    return NextResponse.next();
  }

  // 2. ЛОГІКА ДЛЯ ПРИВАТНИХ МАРШРУТІВ
  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const apiResponse = await checkSession();
        
        if (apiResponse && apiResponse.headers['set-cookie']) {
          // ВИПРАВЛЕНО: Робимо редирект на ту саму адресу (request.url) замість .next()
          // Це змушує браузер зробити повторний запит вже з новими куками
          const response = NextResponse.redirect(request.url);
          
          const setCookieHeader = apiResponse.headers['set-cookie'];
          const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

          cookieArray.forEach((cookieStr) => {
            const parsed = parse(cookieStr);
            const entries = Object.entries(parsed);

            if (entries.length > 0) {
              const [cName, cValue] = entries[0];
              if (cName && typeof cValue === 'string') {
                response.cookies.set(cName, cValue, {
                  path: parsed.Path || '/',
                  httpOnly: cookieStr.toLowerCase().includes('httponly'),
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
                });
              }
            }
          });
          
          return response;
        }
      } catch (err) {
        // Якщо сесія невалідна — на вхід
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
    // Немає токенів — на вхід
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Обмежуємо роботу middleware тільки вказаними маршрутами
  matcher: [
    '/profile/:path*', 
    '/notes/:path*', 
    '/sign-in', 
    '/sign-up'
  ],
};