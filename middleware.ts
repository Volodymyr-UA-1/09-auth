import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Якщо користувач НЕавторизований і йде на приватну сторінку
  if (!token && PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач авторизований і йде на публічну сторінку (login/register)
  if (token && PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};