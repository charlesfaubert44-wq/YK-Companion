/**
 * Rate Limiting Utility
 * 
 * Implements token bucket algorithm for API rate limiting.
 * Prevents abuse and ensures fair resource usage.
 * 
 * @module rate-limiting
 */

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter using Map
 * For production, use Redis or similar distributed cache
 */
class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a request should be allowed
   * 
   * @param {string} identifier - Unique identifier (IP, user ID, etc.)
   * @param {RateLimitConfig} config - Rate limit configuration
   * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
   */
  check(identifier: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No entry or expired entry
    if (!entry || now > entry.resetTime) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Entry exists and is valid
    if (entry.count < config.maxRequests) {
      entry.count++;
      this.store.set(identifier, entry);

      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   * @private
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   * 
   * @param {string} identifier - Identifier to reset
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Get current status for an identifier
   * 
   * @param {string} identifier - Identifier to check
   * @returns {RateLimitEntry | null}
   */
  getStatus(identifier: string): RateLimitEntry | null {
    return this.store.get(identifier) || null;
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Strict limits for authentication
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Moderate limits for API endpoints
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Generous limits for read operations
  read: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Strict limits for write operations
  write: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Very strict for sensitive operations
  sensitive: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Get client identifier from request
 * Uses IP address or user ID if available
 * 
 * @param {Request} request - The request object
 * @param {string} [userId] - Optional user ID
 * @returns {string} Unique identifier for rate limiting
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from various headers (depending on deployment)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Middleware helper for Next.js API routes
 * 
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = checkRateLimit(request, rateLimitConfigs.write);
 *   if (!rateLimitResult.allowed) {
 *     return NextResponse.json(
 *       { error: 'Too many requests' },
 *       { 
 *         status: 429,
 *         headers: rateLimitResult.headers
 *       }
 *     );
 *   }
 *   // ... rest of handler
 * }
 * ```
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig,
  userId?: string
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  headers: Record<string, string>;
} {
  const identifier = getClientIdentifier(request, userId);
  const result = rateLimiter.check(identifier, config);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
  }

  return {
    ...result,
    headers,
  };
}

