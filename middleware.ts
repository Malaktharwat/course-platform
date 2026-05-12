// src/middleware.ts
// This file runs on EVERY request before the page loads.
// It protects routes so only logged-in users can access them.

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If trying to access /admin and NOT an admin → redirect to home
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If trying to access course lesson and NOT logged in → redirect to login
    if (pathname.includes('/learn') && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware if user is NOT authenticated for these paths
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // These paths ALWAYS require login
        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/admin') ||
          pathname.includes('/learn')
        ) {
          return !!token; // true if logged in, false if not
        }
        
        return true; // All other pages are public
      },
    },
  }
);

// Tell Next.js which routes this middleware applies to
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/courses/:path*/learn/:path*',
    '/api/admin/:path*',
    '/api/videos/stream/:path*',
  ],
};