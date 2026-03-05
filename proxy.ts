import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

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
              // Перевірка типу для усунення помилки 2345
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};