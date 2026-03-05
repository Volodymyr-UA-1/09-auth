import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up']; // Додано масив публічних маршрутів

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. ЛОГІКА ДЛЯ ПУБЛІЧНИХ МАРШРУТІВ (Sign-in / Sign-up)
  if (isAuthRoute) {
    if (accessToken) {
      // Якщо залогінений — на головну
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Якщо не залогінений — дозволяємо доступ (просто пропускаємо далі)
    return NextResponse.next();
  }

  // 2. ЛОГІКА ДЛЯ ПРИВАТНИХ МАРШРУТІВ (існувала раніше)
  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const apiResponse = await checkSession();
        if (apiResponse && apiResponse.headers['set-cookie']) {
          const response = NextResponse.next();
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
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*', 
    '/notes/:path*', 
    '/sign-in', 
    '/sign-up'
  ],
};