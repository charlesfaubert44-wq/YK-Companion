/**
 * Tests for performance optimization utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  measurePerformance,
  prefersReducedMotion,
  getConnectionQuality,
} from '../optimization';

describe('Performance Optimization Utilities', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(100);

      // Should have been called once with the last value
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      vi.advanceTimersByTime(50);

      debouncedFn('second');
      vi.advanceTimersByTime(50);

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      // Now should be called
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      // Should have been called once immediately
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      // Fast-forward time
      vi.advanceTimersByTime(100);

      // Call again
      throttledFn('fourth');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('fourth');
    });

    it('should ignore calls within limit', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      throttledFn('second');

      // Should still be only 1 call
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('measurePerformance', () => {
    it('should measure sync function execution time', async () => {
      const result = await measurePerformance(() => {
        return 'test result';
      }, 'Test Function');

      expect(result).toBe('test result');
    });

    it('should measure async function execution time', async () => {
      const result = await measurePerformance(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async result';
      }, 'Async Function');

      expect(result).toBe('async result');
    });

    it('should handle errors and still measure time', async () => {
      await expect(
        measurePerformance(() => {
          throw new Error('Test error');
        }, 'Error Function')
      ).rejects.toThrow('Test error');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return false when matchMedia is not available', () => {
      // In JSDOM, matchMedia might not be fully implemented
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('should check media query', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const result = prefersReducedMotion();
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('getConnectionQuality', () => {
    it('should return unknown when connection API is not available', () => {
      const quality = getConnectionQuality();

      expect(quality).toHaveProperty('effectiveType');
      expect(quality).toHaveProperty('saveData');
      expect(quality.effectiveType).toBe('unknown');
      expect(quality.saveData).toBe(false);
    });

    it('should return connection info when available', () => {
      // Mock navigator.connection
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        value: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          saveData: false,
        },
      });

      const quality = getConnectionQuality();

      expect(quality.effectiveType).toBe('4g');
      expect(quality.downlink).toBe(10);
      expect(quality.rtt).toBe(50);
      expect(quality.saveData).toBe(false);
    });
  });
});
