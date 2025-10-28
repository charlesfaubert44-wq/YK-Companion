/**
 * Client-side rate limiting utility
 * Prevents abuse and excessive API calls
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  /**
   * Check if a request is allowed
   * @param key - Unique identifier (e.g., user ID, IP, action name)
   * @param config - Rate limit configuration
   * @returns true if allowed, false if rate limited
   */
  check(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];
    
    // Filter out old requests outside the window
    timestamps = timestamps.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (timestamps.length >= config.maxRequests) {
      return false;
    }
    
    // Add new request
    timestamps.push(now);
    this.requests.set(key, timestamps);
    
    return true;
  }
  
  /**
   * Get remaining requests
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    const timestamps = this.requests.get(key) || [];
    const recent = timestamps.filter(time => time > windowStart);
    
    return Math.max(0, config.maxRequests - recent.length);
  }
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string) {
    this.requests.delete(key);
  }
  
  /**
   * Clean up old entries (call periodically)
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(time => time > now - maxAge);
      
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

// Common rate limit configs
export const RATE_LIMITS = {
  // Authentication
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  signUp: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  
  // API calls
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
  search: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
  
  // Form submissions
  contactForm: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  garageSale: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
} as const;

/**
 * Wrapper for rate-limited actions
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  config: RateLimitConfig
): T {
  return ((...args: any[]) => {
    if (!rateLimiter.check(key, config)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    return fn(...args);
  }) as T;
}


