import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for security headers and request handling
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  const securityHeaders = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy (limit browser features)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    
    // Content Security Policy
    // Note: In production, consider using nonces for scripts/styles instead of unsafe-inline
    // For Next.js apps, you may need 'unsafe-eval' for development hot reload
    // Remove 'unsafe-eval' in production or use a more strict CSP
    'Content-Security-Policy': [
      "default-src 'self'",
      process.env.NODE_ENV === 'development' 
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://vercel.live https://va.vercel-scripts.com"
        : "script-src 'self' https://cdn.jsdelivr.net https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://api.openweathermap.org https://vitals.vercel-insights.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting headers (for informational purposes)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  
  return response
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
}
