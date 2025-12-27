import {type NextRequest, NextResponse} from 'next/server';

const unauthenticatedPages = ['/login', '/signup'];
const authenticatedPages = ['/dashboard', '/appliances', '/reports', '/settings'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('firebase-session');
  const {pathname} = request.nextUrl;

  // If the user is authenticated and tries to access an unauthenticated page,
  // redirect them to the dashboard.
  if (session && unauthenticatedPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not authenticated and tries to access an authenticated page,
  // redirect them to the login page.
  if (!session && authenticatedPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
