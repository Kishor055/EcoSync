import {type NextRequest, NextResponse} from 'next/server';

const unauthenticatedPages = ['/login', '/signup', '/'];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Optimistically allow most pages, but in a real app you'd check cookies here
  // For the purpose of this prototype, we handle auth redirects on the client
  // within pages that require a user ID.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
