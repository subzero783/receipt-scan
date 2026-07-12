import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default async function middleware(request, event) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Handle CORS for all API routes
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      const preflightHeaders = {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': 'true',
      };
      return new NextResponse(null, { status: 204, headers: preflightHeaders });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // Handle next-auth middleware for protected pages
  const protectedPages = ["/properties/add", "/profile", "/properties/saved", "/messages"];
  const isProtected = protectedPages.some(page => pathname.startsWith(page));

  if (isProtected) {
    return withAuth(request, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/properties/add",
    "/profile",
    "/properties/saved",
    "/messages",
    "/api/:path*",
  ],
};
