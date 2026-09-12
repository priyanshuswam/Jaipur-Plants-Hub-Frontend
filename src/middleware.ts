/**
 * Next.js Middleware for Route Protection
 * Runs on Edge Runtime before page render
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/products',
  '/categories',
  '/services',
  '/blogs',
  '/gallery',
  '/about',
  '/contact',
  '/nursery',
  '/garden-design',
  '/farmhouse-development',
  '/query',
  '/terms',
  '/privacy-policy',
  '/returns',
  '/faq',
];

const ADMIN_ROUTES = ['/admin'];
const USER_ROUTES = ['/account', '/cart', '/checkout', '/wishlist'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
  
  if (isPublicRoute) return NextResponse.next();

  // Check for authentication tokens
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Try to parse Zustand persisted auth state
  let isAuthenticated = false;
  let userRole = '';
  
  // Check localStorage cookie (Next.js doesn't have access to localStorage, but Zustand persists to it)
  // For now, just rely on the accessToken cookie which is the source of truth
  isAuthenticated = !!accessToken;

  // Protect admin routes
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    // Note: We can't check the role here without decoding JWT or making a request
    // The admin layout will handle role-based redirect on client side
  }

  // Protect user routes
  const isUserRoute = USER_ROUTES.some(route => pathname.startsWith(route));
  if (isUserRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, fonts (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|fonts).*)',
  ],
};
