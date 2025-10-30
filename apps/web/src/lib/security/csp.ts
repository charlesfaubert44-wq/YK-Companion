/**
 * Content Security Policy (CSP) Configuration
 *
 * Implements strict CSP headers to prevent XSS and other injection attacks
 */

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'frame-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'upgrade-insecure-requests': boolean;
}

/**
 * Generate a nonce for inline scripts
 */
export function generateNonce(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * CSP directives for production
 */
export const cspDirectives: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'", // Required for Next.js development
    "'unsafe-inline'", // Required for styled-components, should use nonces in production
    'https://cdn.vercel-insights.com',
    'https://js.stripe.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and Tailwind
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://api.mapbox.com',
    'https://*.mapbox.com',
    'https://www.googletagmanager.com',
  ],
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'https://*.supabase.in',
    'wss://*.supabase.co',
    'https://api.mapbox.com',
    'https://events.mapbox.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com',
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ].filter(Boolean),
  'frame-src': ["'self'", 'https://js.stripe.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': true,
};

/**
 * Build CSP header string from directives
 */
export function buildCSPHeader(directives: CSPDirectives, nonce?: string): string {
  const policies: string[] = [];

  Object.entries(directives).forEach(([key, value]) => {
    if (key === 'upgrade-insecure-requests') {
      if (value) {
        policies.push('upgrade-insecure-requests');
      }
      return;
    }

    let directive = value as string[];

    // Add nonce to script-src if provided
    if (key === 'script-src' && nonce) {
      directive = [...directive, `'nonce-${nonce}'`];
    }

    policies.push(`${key} ${directive.join(' ')}`);
  });

  return policies.join('; ');
}

/**
 * Get CSP header for Next.js middleware
 */
export function getCSPHeader(nonce?: string): string {
  return buildCSPHeader(cspDirectives, nonce);
}

/**
 * Development CSP (more permissive)
 */
export const devCSPDirectives: CSPDirectives = {
  ...cspDirectives,
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https:'],
  'connect-src': ["'self'", 'https:', 'wss:', 'http://localhost:*', 'ws://localhost:*'],
};

/**
 * Get appropriate CSP based on environment
 */
export function getEnvironmentCSP(nonce?: string): string {
  const directives = process.env.NODE_ENV === 'production' ? cspDirectives : devCSPDirectives;

  return buildCSPHeader(directives, nonce);
}
