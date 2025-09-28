import { NextResponse, NextRequest } from 'next/server';
import { JWTPayload, jwtVerify } from 'jose'; // Edge runtime ke liye

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Edge-compatible encoding
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.log('Token verification failed:', err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  const decodedToken = accessToken ? await verifyToken(accessToken) : null;
  const userRole = decodedToken?.role || 'customer';

  console.log('Access Token:', accessToken);
  console.log('User Role:', userRole);

  // protect login and signup routes for authenticated users
  if (accessToken && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Profile route protection
  if (!accessToken && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin route protection
  if ((!accessToken || userRole !== 'admin') && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/profile',
    '/admin/:path*'
  ],
};
