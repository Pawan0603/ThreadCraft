import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let accessToken = request.cookies.get('accessToken')?.value;

  if (accessToken && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    // If access token exists and user is trying to access login or signup page, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

}

export const config = {
  matcher: ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'],
}