/**
 * Tests for rate limiting utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimit, RATE_LIMITS, getClientIP } from '../rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset rate limits before each test
    resetRateLimit('test-identifier');
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const config = { interval: 60000, maxRequests: 5 };

      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('test-user', config);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(5 - i - 1);
      }
    });

    it('should block requests exceeding limit', () => {
      const config = { interval: 60000, maxRequests: 3 };

      // Make 3 allowed requests
      checkRateLimit('test-user', config);
      checkRateLimit('test-user', config);
      checkRateLimit('test-user', config);

      // 4th request should be blocked
      const result = checkRateLimit('test-user', config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after interval expires', () => {
      const config = { interval: 100, maxRequests: 2 }; // 100ms interval

      // Use up limit
      checkRateLimit('test-user', config);
      checkRateLimit('test-user', config);

      // Should be blocked
      let result = checkRateLimit('test-user', config);
      expect(result.allowed).toBe(false);

      // Wait for interval to expire
      return new Promise(resolve => {
        setTimeout(() => {
          // Should be allowed again after reset
          result = checkRateLimit('test-user', config);
          expect(result.allowed).toBe(true);
          resolve(undefined);
        }, 150);
      });
    });

    it('should have independent limits per identifier', () => {
      const config = { interval: 60000, maxRequests: 2 };

      // User 1 uses up their limit
      checkRateLimit('user1', config);
      checkRateLimit('user1', config);

      // User 2 should still have their full limit
      const result = checkRateLimit('user2', config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);
    });

    it('should provide correct reset time', () => {
      const config = { interval: 60000, maxRequests: 5 };
      const before = Date.now();

      const result = checkRateLimit('test-user', config);

      const after = Date.now();
      expect(result.resetTime).toBeGreaterThan(before);
      expect(result.resetTime).toBeLessThan(after + config.interval + 1000);
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-real-ip': '192.168.1.1',
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should return unknown if no IP headers', () => {
      const request = new Request('http://localhost');

      const ip = getClientIP(request);
      expect(ip).toBe('unknown');
    });
  });

  describe('RATE_LIMITS configuration', () => {
    it('should have strict limits for auth', () => {
      expect(RATE_LIMITS.AUTH.maxRequests).toBe(5);
      expect(RATE_LIMITS.AUTH.interval).toBe(15 * 60 * 1000);
    });

    it('should have medium limits for API', () => {
      expect(RATE_LIMITS.API.maxRequests).toBe(60);
      expect(RATE_LIMITS.API.interval).toBe(60 * 1000);
    });

    it('should have relaxed limits for public content', () => {
      expect(RATE_LIMITS.PUBLIC.maxRequests).toBe(120);
    });

    it('should have strict limits for contact forms', () => {
      expect(RATE_LIMITS.CONTACT.maxRequests).toBe(3);
      expect(RATE_LIMITS.CONTACT.interval).toBe(60 * 60 * 1000);
    });
  });

  describe('resetRateLimit', () => {
    it('should clear rate limit for identifier', () => {
      const config = { interval: 60000, maxRequests: 1 };

      // Use up limit
      checkRateLimit('test-user', config);
      checkRateLimit('test-user', config);

      // Should be blocked
      let result = checkRateLimit('test-user', config);
      expect(result.allowed).toBe(false);

      // Reset
      resetRateLimit('test-user');

      // Should be allowed again
      result = checkRateLimit('test-user', config);
      expect(result.allowed).toBe(true);
    });
  });
});
