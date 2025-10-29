/**
 * Enhanced Middleware with Security Headers and Rate Limiting
 * 
 * This file contains the enhanced middleware with CSP and rate limiting.
 * To use: rename to middleware.ts and backup the existing one
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getEnvironmentCSP, generateNonce } from '@/lib/security/csp';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/security/rate-limiter';

/**
 * Middleware for security headers, rate limiting, and admin route protection
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting based on route
  const rateLimitResponse = await applyRateLimiting(request, pathname);
  if (rateLimitResponse) {
    return rateLimitResponse; // Return 429 if rate limited
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Admin Route Protection
  if (pathname.startsWith('/admin')) {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user, redirect to home
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    // If not admin, redirect to home
    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Apply enhanced security headers
  response = applySecurityHeaders(response);

  return response;
}

/**
 * Apply rate limiting based on route
 */
async function applyRateLimiting(
  request: NextRequest,
  pathname: string
): Promise<Response | null> {
  const ip = getClientIP(request);

  // Determine rate limit config based on route
  let config: { interval: number; maxRequests: number } = RATE_LIMITS.PUBLIC;

  if (pathname.includes('/auth/') || pathname.includes('sign-in') || pathname.includes('sign-up')) {
    config = RATE_LIMITS.AUTH;
  } else if (pathname.startsWith('/api/contact')) {
    config = RATE_LIMITS.CONTACT;
  } else if (pathname.startsWith('/api/admin')) {
    config = RATE_LIMITS.ADMIN;
  } else if (pathname.startsWith('/api')) {
    config = RATE_LIMITS.API;
  }

  const { allowed, remaining, resetTime } = checkRateLimit(ip, config);

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Apply comprehensive security headers
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = response.headers;

  // Generate nonce for CSP
  const nonce = generateNonce();

  // Content Security Policy (enhanced)
  headers.set('Content-Security-Policy', getEnvironmentCSP(nonce));

  // Prevent clickjacking attacks
  headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // Strict referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (limit browser features)
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Strict Transport Security (HSTS) - only in production
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // DNS prefetch control
  headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

