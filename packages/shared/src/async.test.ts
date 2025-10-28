/**
 * Tests for async utilities
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  safeAsync,
  retryWithBackoff,
  asyncPool,
  asyncSequential,
  withTimeout,
  debounceAsync,
  throttleAsync,
  sleep,
  pollUntil,
  asyncCache,
  asyncAllSettled,
  asyncBatch,
} from './async';

describe('async utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('safeAsync', () => {
    it('should return success result for resolved promise', async () => {
      const result = await safeAsync(async () => 'test-data');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test-data');
      }
    });

    it('should return error result for rejected promise', async () => {
      const error = new Error('Test error');
      const result = await safeAsync(async () => {
        throw error;
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(error);
      }
    });

    it('should accept both promise and function', async () => {
      const promise = Promise.resolve('direct-promise');
      const result = await safeAsync(promise);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('direct-promise');
      }
    });

    it('should handle different error types', async () => {
      const stringError = await safeAsync(async () => {
        throw 'string error';
      });
      
      expect(stringError.success).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      let attempts = 0;
      const fn = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Retry');
        }
        return 'success';
      });

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 100,
      });

      // Fast-forward timers for each retry
      await vi.advanceTimersByTimeAsync(100); // First retry
      await vi.advanceTimersByTimeAsync(200); // Second retry (exponential backoff)
      
      const result = await promise;
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw last error after max retries', async () => {
      const error = new Error('Persistent error');
      const fn = vi.fn().mockRejectedValue(error);

      const promise = retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 100,
      });

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);

      await expect(promise).rejects.toThrow('Persistent error');
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should call onRetry callback', async () => {
      const onRetry = vi.fn();
      let attempts = 0;
      const fn = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Retry');
        }
        return 'success';
      });

      const promise = retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 100,
        onRetry,
      });

      await vi.advanceTimersByTimeAsync(100);
      
      await promise;
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
    });

    it('should respect maxDelay', async () => {
      let attempts = 0;
      const fn = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 4) {
          throw new Error('Retry');
        }
        return 'success';
      });

      const promise = retryWithBackoff(fn, {
        maxRetries: 5,
        initialDelay: 100,
        maxDelay: 500,
        backoffMultiplier: 3,
      });

      await vi.advanceTimersByTimeAsync(100); // 1st retry: 100ms
      await vi.advanceTimersByTimeAsync(300); // 2nd retry: 300ms
      await vi.advanceTimersByTimeAsync(500); // 3rd retry: capped at 500ms (not 900ms)
      
      await promise;
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });

  describe('asyncPool', () => {
    it('should process all items', async () => {
      const items = [1, 2, 3, 4, 5];
      const fn = vi.fn().mockImplementation(async (n: number) => n * 2);
      
      const results = await asyncPool(items, fn, 2);
      
      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should respect concurrency limit', async () => {
      vi.useRealTimers(); // Use real timers for this test
      
      let concurrent = 0;
      let maxConcurrent = 0;

      const items = [1, 2, 3, 4, 5];
      const fn = vi.fn().mockImplementation(async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise(resolve => setTimeout(resolve, 10));
        concurrent--;
        return true;
      });

      await asyncPool(items, fn, 2);
      
      expect(maxConcurrent).toBeLessThanOrEqual(2);
      
      vi.useFakeTimers(); // Restore fake timers
    });

    it('should preserve order of results', async () => {
      vi.useRealTimers(); // Use real timers for this test
      
      const items = [1, 2, 3, 4, 5];
      const fn = vi.fn().mockImplementation(async (n: number) => {
        // Simulate varying delays
        await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
        return n * 2;
      });
      
      const results = await asyncPool(items, fn, 3);
      
      expect(results).toEqual([2, 4, 6, 8, 10]);
      
      vi.useFakeTimers(); // Restore fake timers
    });

    it('should pass index to function', async () => {
      const items = ['a', 'b', 'c'];
      const fn = vi.fn().mockImplementation(async (item: string, index: number) => {
        return `${item}-${index}`;
      });
      
      const results = await asyncPool(items, fn, 2);
      
      expect(results).toEqual(['a-0', 'b-1', 'c-2']);
    });
  });

  describe('asyncSequential', () => {
    it('should execute functions sequentially', async () => {
      const order: number[] = [];
      const items = [1, 2, 3];
      const fn = vi.fn().mockImplementation(async (n: number) => {
        order.push(n);
        return n * 2;
      });
      
      const results = await asyncSequential(items, fn);
      
      expect(results).toEqual([2, 4, 6]);
      expect(order).toEqual([1, 2, 3]);
    });

    it('should wait for each function to complete before starting next', async () => {
      vi.useRealTimers(); // Use real timers for this test
      
      let current = 0;
      const items = [1, 2, 3];
      
      const fn = vi.fn().mockImplementation(async (n: number) => {
        expect(current).toBe(n - 1);
        current = n;
        await new Promise(resolve => setTimeout(resolve, 10));
        return n;
      });
      
      await asyncSequential(items, fn);
      expect(fn).toHaveBeenCalledTimes(3);
      
      vi.useFakeTimers(); // Restore fake timers
    });
  });

  describe('withTimeout', () => {
    it('should resolve if promise completes before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await withTimeout(promise, 1000);
      
      expect(result).toBe('success');
    });

    it('should reject if promise exceeds timeout', async () => {
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('late'), 2000);
      });

      const timeoutPromise = withTimeout(promise, 1000);
      
      await vi.advanceTimersByTimeAsync(1000);
      
      await expect(timeoutPromise).rejects.toThrow('Operation timed out');
    });

    it('should use custom timeout error message', async () => {
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('late'), 2000);
      });

      const timeoutPromise = withTimeout(promise, 1000, 'Custom timeout error');
      
      await vi.advanceTimersByTimeAsync(1000);
      
      await expect(timeoutPromise).rejects.toThrow('Custom timeout error');
    });
  });

  describe('debounceAsync', () => {
    it('should debounce multiple calls', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      debounced('call1');
      debounced('call2');
      debounced('call3');

      await vi.advanceTimersByTimeAsync(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call3');
    });

    it('should cancel previous calls', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      const promise1 = debounced('call1');
      const promise2 = debounced('call2');

      await vi.advanceTimersByTimeAsync(100);

      await expect(promise1).rejects.toThrow('Debounced call cancelled');
      await expect(promise2).resolves.toBe('result');
    });

    it('should handle errors from function', async () => {
      const error = new Error('Test error');
      const fn = vi.fn().mockRejectedValue(error);
      const debounced = debounceAsync(fn, 100);

      const promise = debounced('call');

      await vi.advanceTimersByTimeAsync(100);

      await expect(promise).rejects.toThrow('Test error');
    });
  });

  describe('throttleAsync', () => {
    it('should throttle multiple calls', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const throttled = throttleAsync(fn, 100);

      const result1 = await throttled('call1');
      const result2 = await throttled('call2'); // Should be null (throttled)

      expect(result1).toBe('result');
      expect(result2).toBe(null);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow execution after delay', async () => {
      vi.useRealTimers(); // Use real timers for this test
      
      const fn = vi.fn().mockResolvedValue('result');
      const throttled = throttleAsync(fn, 50);

      await throttled('call1');
      await sleep(60);
      const result2 = await throttled('call2');

      expect(result2).toBe('result');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('sleep', () => {
    it('should resolve after specified delay', async () => {
      const sleepPromise = sleep(100);
      await vi.advanceTimersByTimeAsync(100);
      await sleepPromise;

      // With fake timers, we just verify it completes
      expect(true).toBe(true);
    });
  });

  describe('pollUntil', () => {
    it('should poll until condition is met', async () => {
      let count = 0;
      const fn = vi.fn().mockImplementation(async () => {
        count++;
        return count;
      });

      const promise = pollUntil(fn, (value) => value === 3, {
        interval: 100,
        timeout: 1000,
      });

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);

      const result = await promise;
      
      expect(result).toBe(3);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should timeout if condition never met', async () => {
      const fn = vi.fn().mockResolvedValue(false);

      const promise = pollUntil(fn, (value) => value === true, {
        interval: 100,
        timeout: 500,
      });

      await vi.advanceTimersByTimeAsync(500);

      await expect(promise).rejects.toThrow('Polling timed out after 500ms');
    });

    it('should call onPoll callback', async () => {
      const onPoll = vi.fn();
      let count = 0;
      const fn = vi.fn().mockImplementation(async () => ++count);

      const promise = pollUntil(fn, (value) => value === 2, {
        interval: 100,
        onPoll,
      });

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);

      await promise;
      
      expect(onPoll).toHaveBeenCalledTimes(2);
      expect(onPoll).toHaveBeenCalledWith(1, 1);
      expect(onPoll).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('asyncCache', () => {
    it('should cache results', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const cached = asyncCache(fn, 1000);

      const result1 = await cached('arg1');
      const result2 = await cached('arg1'); // Should use cache

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cache different arguments separately', async () => {
      const fn = vi.fn().mockImplementation(async (arg: string) => `result-${arg}`);
      const cached = asyncCache(fn, 1000);

      const result1 = await cached('arg1');
      const result2 = await cached('arg2');

      expect(result1).toBe('result-arg1');
      expect(result2).toBe('result-arg2');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should expire cache after TTL', async () => {
      vi.useRealTimers();
      
      const fn = vi.fn().mockResolvedValue('result');
      const cached = asyncCache(fn, 50);

      await cached('arg1');
      await sleep(60);
      await cached('arg1'); // Should fetch again

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('asyncAllSettled', () => {
    it('should return all results including errors', async () => {
      const promises = [
        Promise.resolve('success1'),
        Promise.reject(new Error('error1')),
        Promise.resolve('success2'),
      ];

      const results = await asyncAllSettled(promises);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ success: true, data: 'success1' });
      expect(results[1]).toEqual({ success: false, error: expect.any(Error) });
      expect(results[2]).toEqual({ success: true, data: 'success2' });
    });

    it('should handle all successful promises', async () => {
      const promises = [
        Promise.resolve('a'),
        Promise.resolve('b'),
        Promise.resolve('c'),
      ];

      const results = await asyncAllSettled(promises);

      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle all failed promises', async () => {
      const promises = [
        Promise.reject(new Error('e1')),
        Promise.reject(new Error('e2')),
      ];

      const results = await asyncAllSettled(promises);

      expect(results.every(r => !r.success)).toBe(true);
    });
  });

  describe('asyncBatch', () => {
    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      const fn = vi.fn().mockImplementation(async (n: number) => n * 2);

      const results = await asyncBatch(items, fn, 3);

      expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
      expect(fn).toHaveBeenCalledTimes(7);
    });

    it('should delay between batches', async () => {
      const items = [1, 2, 3, 4];
      const fn = vi.fn().mockResolvedValue(true);

      const promise = asyncBatch(items, fn, 2, 100);

      // First batch processes immediately
      await Promise.resolve();
      
      // Wait for delay between batches
      await vi.advanceTimersByTimeAsync(100);
      
      await promise;

      expect(fn).toHaveBeenCalledTimes(4);
    });

    it('should preserve order', async () => {
      const items = [1, 2, 3, 4, 5];
      const fn = vi.fn().mockImplementation(async (n: number) => n * 2);

      const results = await asyncBatch(items, fn, 2);

      expect(results).toEqual([2, 4, 6, 8, 10]);
    });
  });
});

