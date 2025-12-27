import {type NextRequest, NextResponse} from 'next/server';

const unauthenticatedPages = ['/login', '/signup', '/'];
const authenticatedPages = ['/dashboard', '/appliances', '/reports', '/settings'];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // The Firebase Auth SDK manages session persistence on the client-side automatically.
  // We can't easily and reliably access the auth state on the server without a custom session mechanism.
  // For this MVP, we will optimistically assume the user is logged in if they are not on an auth page.
  // This is not secure for production but simplifies the auth flow for prototyping.

  const isAuthPage = unauthenticatedPages.some((page) => pathname === page);
  const isAppPage = authenticatedPages.some((page) => pathname.startsWith(page));

  // The landing page is a special case, we don't want to redirect from there
  if(pathname === '/') {
    return NextResponse.next();
  }

  // A truly secure implementation would involve server-side session validation.
  // For example, checking a session cookie that is set after a user logs in.
  // The client would send its Firebase ID token to a server endpoint, which would
  // verify it and create a secure, HTTP-only session cookie.
  // The middleware would then validate this cookie on each request to a protected route.

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
