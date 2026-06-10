import { type NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise Middleware
 * Handles high-level path routing. Concrete session validation 
 * occurs in the AuthGuard client-side component.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Basic redirection logic for common paths
  if (pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url));
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
