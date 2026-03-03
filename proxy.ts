import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));

  // 1. Якщо авторизований — на головну сторінку нотаток
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/notes/filter/all', request.url));
  }

  // 2. Спроба оновити токен, якщо він зник
    if (!accessToken && refreshToken) {
      
        try {
        console.log('attempt refresh session');
      const apiResponse = await checkSession();

      if (apiResponse && apiResponse.headers['set-cookie']) {
        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/notes/filter/all', request.url))
          : NextResponse.next();

        const setCookieHeader = apiResponse.headers['set-cookie'];
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

        cookieArray.forEach((cookieStr) => {
  const parsed = parse(cookieStr);
  const entries = Object.entries(parsed);

  if (entries.length > 0) {
    const [cName, cValue] = entries[0];

    if (typeof cName === 'string' && typeof cValue === 'string') {
      // Використовуємо каст 'as any', щоб прибрати помилку 2345
      const cookieOptions: any = {
        path: parsed.Path || '/',
        httpOnly: cookieStr.toLowerCase().includes('httponly'),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      };

      if (parsed.Expires) {
        cookieOptions.expires = new Date(parsed.Expires);
      }

      if (parsed['Max-Age']) {
        cookieOptions.maxAge = Number(parsed['Max-Age']);
      }

      response.cookies.set(cName, cValue, cookieOptions);
    }
  }
});

        return response;
      }
    } catch (err) {
      if (isPrivateRoute) {
        const loginRes = NextResponse.redirect(new URL('/sign-in', request.url));
        loginRes.cookies.delete('accessToken');
        loginRes.cookies.delete('refreshToken');
        return loginRes;
      }
    }
  }

  // 3. Захист приватних маршрутів
  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// ВИПРАВЛЕННЯ 404: Правильний матчер, що ігнорує статику та API
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};