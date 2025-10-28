"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for async utilities
 */
const vitest_1 = require("vitest");
const async_1 = require("./async");
(0, vitest_1.describe)('async utilities', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.describe)('safeAsync', () => {
        (0, vitest_1.it)('should return success result for resolved promise', async () => {
            const result = await (0, async_1.safeAsync)(async () => 'test-data');
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data).toBe('test-data');
            }
        });
        (0, vitest_1.it)('should return error result for rejected promise', async () => {
            const error = new Error('Test error');
            const result = await (0, async_1.safeAsync)(async () => {
                throw error;
            });
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error).toBe(error);
            }
        });
        (0, vitest_1.it)('should accept both promise and function', async () => {
            const promise = Promise.resolve('direct-promise');
            const result = await (0, async_1.safeAsync)(promise);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data).toBe('direct-promise');
            }
        });
        (0, vitest_1.it)('should handle different error types', async () => {
            const stringError = await (0, async_1.safeAsync)(async () => {
                throw 'string error';
            });
            (0, vitest_1.expect)(stringError.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('retryWithBackoff', () => {
        (0, vitest_1.it)('should succeed on first attempt', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue('success');
            const result = await (0, async_1.retryWithBackoff)(fn);
            (0, vitest_1.expect)(result).toBe('success');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should retry on failure and eventually succeed', async () => {
            let attempts = 0;
            const fn = vitest_1.vi.fn().mockImplementation(async () => {
                attempts++;
                if (attempts < 3) {
                    throw new Error('Retry');
                }
                return 'success';
            });
            const promise = (0, async_1.retryWithBackoff)(fn, {
                maxRetries: 3,
                initialDelay: 100,
            });
            // Fast-forward timers for each retry
            await vitest_1.vi.advanceTimersByTimeAsync(100); // First retry
            await vitest_1.vi.advanceTimersByTimeAsync(200); // Second retry (exponential backoff)
            const result = await promise;
            (0, vitest_1.expect)(result).toBe('success');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(3);
        });
        (0, vitest_1.it)('should throw last error after max retries', async () => {
            const error = new Error('Persistent error');
            const fn = vitest_1.vi.fn().mockRejectedValue(error);
            const promise = (0, async_1.retryWithBackoff)(fn, {
                maxRetries: 2,
                initialDelay: 100,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await vitest_1.vi.advanceTimersByTimeAsync(200);
            await (0, vitest_1.expect)(promise).rejects.toThrow('Persistent error');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });
        (0, vitest_1.it)('should call onRetry callback', async () => {
            const onRetry = vitest_1.vi.fn();
            let attempts = 0;
            const fn = vitest_1.vi.fn().mockImplementation(async () => {
                attempts++;
                if (attempts < 2) {
                    throw new Error('Retry');
                }
                return 'success';
            });
            const promise = (0, async_1.retryWithBackoff)(fn, {
                maxRetries: 2,
                initialDelay: 100,
                onRetry,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await promise;
            (0, vitest_1.expect)(onRetry).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(onRetry).toHaveBeenCalledWith(vitest_1.expect.any(Error), 1);
        });
        (0, vitest_1.it)('should respect maxDelay', async () => {
            let attempts = 0;
            const fn = vitest_1.vi.fn().mockImplementation(async () => {
                attempts++;
                if (attempts < 4) {
                    throw new Error('Retry');
                }
                return 'success';
            });
            const promise = (0, async_1.retryWithBackoff)(fn, {
                maxRetries: 5,
                initialDelay: 100,
                maxDelay: 500,
                backoffMultiplier: 3,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(100); // 1st retry: 100ms
            await vitest_1.vi.advanceTimersByTimeAsync(300); // 2nd retry: 300ms
            await vitest_1.vi.advanceTimersByTimeAsync(500); // 3rd retry: capped at 500ms (not 900ms)
            await promise;
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(4);
        });
    });
    (0, vitest_1.describe)('asyncPool', () => {
        (0, vitest_1.it)('should process all items', async () => {
            const items = [1, 2, 3, 4, 5];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => n * 2);
            const results = await (0, async_1.asyncPool)(items, fn, 2);
            (0, vitest_1.expect)(results).toEqual([2, 4, 6, 8, 10]);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(5);
        });
        (0, vitest_1.it)('should respect concurrency limit', async () => {
            vitest_1.vi.useRealTimers(); // Use real timers for this test
            let concurrent = 0;
            let maxConcurrent = 0;
            const items = [1, 2, 3, 4, 5];
            const fn = vitest_1.vi.fn().mockImplementation(async () => {
                concurrent++;
                maxConcurrent = Math.max(maxConcurrent, concurrent);
                await new Promise(resolve => setTimeout(resolve, 10));
                concurrent--;
                return true;
            });
            await (0, async_1.asyncPool)(items, fn, 2);
            (0, vitest_1.expect)(maxConcurrent).toBeLessThanOrEqual(2);
            vitest_1.vi.useFakeTimers(); // Restore fake timers
        });
        (0, vitest_1.it)('should preserve order of results', async () => {
            vitest_1.vi.useRealTimers(); // Use real timers for this test
            const items = [1, 2, 3, 4, 5];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => {
                // Simulate varying delays
                await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
                return n * 2;
            });
            const results = await (0, async_1.asyncPool)(items, fn, 3);
            (0, vitest_1.expect)(results).toEqual([2, 4, 6, 8, 10]);
            vitest_1.vi.useFakeTimers(); // Restore fake timers
        });
        (0, vitest_1.it)('should pass index to function', async () => {
            const items = ['a', 'b', 'c'];
            const fn = vitest_1.vi.fn().mockImplementation(async (item, index) => {
                return `${item}-${index}`;
            });
            const results = await (0, async_1.asyncPool)(items, fn, 2);
            (0, vitest_1.expect)(results).toEqual(['a-0', 'b-1', 'c-2']);
        });
    });
    (0, vitest_1.describe)('asyncSequential', () => {
        (0, vitest_1.it)('should execute functions sequentially', async () => {
            const order = [];
            const items = [1, 2, 3];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => {
                order.push(n);
                return n * 2;
            });
            const results = await (0, async_1.asyncSequential)(items, fn);
            (0, vitest_1.expect)(results).toEqual([2, 4, 6]);
            (0, vitest_1.expect)(order).toEqual([1, 2, 3]);
        });
        (0, vitest_1.it)('should wait for each function to complete before starting next', async () => {
            vitest_1.vi.useRealTimers(); // Use real timers for this test
            let current = 0;
            const items = [1, 2, 3];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => {
                (0, vitest_1.expect)(current).toBe(n - 1);
                current = n;
                await new Promise(resolve => setTimeout(resolve, 10));
                return n;
            });
            await (0, async_1.asyncSequential)(items, fn);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(3);
            vitest_1.vi.useFakeTimers(); // Restore fake timers
        });
    });
    (0, vitest_1.describe)('withTimeout', () => {
        (0, vitest_1.it)('should resolve if promise completes before timeout', async () => {
            const promise = Promise.resolve('success');
            const result = await (0, async_1.withTimeout)(promise, 1000);
            (0, vitest_1.expect)(result).toBe('success');
        });
        (0, vitest_1.it)('should reject if promise exceeds timeout', async () => {
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve('late'), 2000);
            });
            const timeoutPromise = (0, async_1.withTimeout)(promise, 1000);
            await vitest_1.vi.advanceTimersByTimeAsync(1000);
            await (0, vitest_1.expect)(timeoutPromise).rejects.toThrow('Operation timed out');
        });
        (0, vitest_1.it)('should use custom timeout error message', async () => {
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve('late'), 2000);
            });
            const timeoutPromise = (0, async_1.withTimeout)(promise, 1000, 'Custom timeout error');
            await vitest_1.vi.advanceTimersByTimeAsync(1000);
            await (0, vitest_1.expect)(timeoutPromise).rejects.toThrow('Custom timeout error');
        });
    });
    (0, vitest_1.describe)('debounceAsync', () => {
        (0, vitest_1.it)('should debounce multiple calls', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const debounced = (0, async_1.debounceAsync)(fn, 100);
            debounced('call1');
            debounced('call2');
            debounced('call3');
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(fn).toHaveBeenCalledWith('call3');
        });
        (0, vitest_1.it)('should cancel previous calls', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const debounced = (0, async_1.debounceAsync)(fn, 100);
            const promise1 = debounced('call1');
            const promise2 = debounced('call2');
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await (0, vitest_1.expect)(promise1).rejects.toThrow('Debounced call cancelled');
            await (0, vitest_1.expect)(promise2).resolves.toBe('result');
        });
        (0, vitest_1.it)('should handle errors from function', async () => {
            const error = new Error('Test error');
            const fn = vitest_1.vi.fn().mockRejectedValue(error);
            const debounced = (0, async_1.debounceAsync)(fn, 100);
            const promise = debounced('call');
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await (0, vitest_1.expect)(promise).rejects.toThrow('Test error');
        });
    });
    (0, vitest_1.describe)('throttleAsync', () => {
        (0, vitest_1.it)('should throttle multiple calls', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const throttled = (0, async_1.throttleAsync)(fn, 100);
            const result1 = await throttled('call1');
            const result2 = await throttled('call2'); // Should be null (throttled)
            (0, vitest_1.expect)(result1).toBe('result');
            (0, vitest_1.expect)(result2).toBe(null);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should allow execution after delay', async () => {
            vitest_1.vi.useRealTimers(); // Use real timers for this test
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const throttled = (0, async_1.throttleAsync)(fn, 50);
            await throttled('call1');
            await (0, async_1.sleep)(60);
            const result2 = await throttled('call2');
            (0, vitest_1.expect)(result2).toBe('result');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(2);
        });
    });
    (0, vitest_1.describe)('sleep', () => {
        (0, vitest_1.it)('should resolve after specified delay', async () => {
            const sleepPromise = (0, async_1.sleep)(100);
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await sleepPromise;
            // With fake timers, we just verify it completes
            (0, vitest_1.expect)(true).toBe(true);
        });
    });
    (0, vitest_1.describe)('pollUntil', () => {
        (0, vitest_1.it)('should poll until condition is met', async () => {
            let count = 0;
            const fn = vitest_1.vi.fn().mockImplementation(async () => {
                count++;
                return count;
            });
            const promise = (0, async_1.pollUntil)(fn, (value) => value === 3, {
                interval: 100,
                timeout: 1000,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            const result = await promise;
            (0, vitest_1.expect)(result).toBe(3);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(3);
        });
        (0, vitest_1.it)('should timeout if condition never met', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue(false);
            const promise = (0, async_1.pollUntil)(fn, (value) => value === true, {
                interval: 100,
                timeout: 500,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(500);
            await (0, vitest_1.expect)(promise).rejects.toThrow('Polling timed out after 500ms');
        });
        (0, vitest_1.it)('should call onPoll callback', async () => {
            const onPoll = vitest_1.vi.fn();
            let count = 0;
            const fn = vitest_1.vi.fn().mockImplementation(async () => ++count);
            const promise = (0, async_1.pollUntil)(fn, (value) => value === 2, {
                interval: 100,
                onPoll,
            });
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await promise;
            (0, vitest_1.expect)(onPoll).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(onPoll).toHaveBeenCalledWith(1, 1);
            (0, vitest_1.expect)(onPoll).toHaveBeenCalledWith(2, 2);
        });
    });
    (0, vitest_1.describe)('asyncCache', () => {
        (0, vitest_1.it)('should cache results', async () => {
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const cached = (0, async_1.asyncCache)(fn, 1000);
            const result1 = await cached('arg1');
            const result2 = await cached('arg1'); // Should use cache
            (0, vitest_1.expect)(result1).toBe('result');
            (0, vitest_1.expect)(result2).toBe('result');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should cache different arguments separately', async () => {
            const fn = vitest_1.vi.fn().mockImplementation(async (arg) => `result-${arg}`);
            const cached = (0, async_1.asyncCache)(fn, 1000);
            const result1 = await cached('arg1');
            const result2 = await cached('arg2');
            (0, vitest_1.expect)(result1).toBe('result-arg1');
            (0, vitest_1.expect)(result2).toBe('result-arg2');
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(2);
        });
        (0, vitest_1.it)('should expire cache after TTL', async () => {
            vitest_1.vi.useRealTimers();
            const fn = vitest_1.vi.fn().mockResolvedValue('result');
            const cached = (0, async_1.asyncCache)(fn, 50);
            await cached('arg1');
            await (0, async_1.sleep)(60);
            await cached('arg1'); // Should fetch again
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(2);
        });
    });
    (0, vitest_1.describe)('asyncAllSettled', () => {
        (0, vitest_1.it)('should return all results including errors', async () => {
            const promises = [
                Promise.resolve('success1'),
                Promise.reject(new Error('error1')),
                Promise.resolve('success2'),
            ];
            const results = await (0, async_1.asyncAllSettled)(promises);
            (0, vitest_1.expect)(results).toHaveLength(3);
            (0, vitest_1.expect)(results[0]).toEqual({ success: true, data: 'success1' });
            (0, vitest_1.expect)(results[1]).toEqual({ success: false, error: vitest_1.expect.any(Error) });
            (0, vitest_1.expect)(results[2]).toEqual({ success: true, data: 'success2' });
        });
        (0, vitest_1.it)('should handle all successful promises', async () => {
            const promises = [
                Promise.resolve('a'),
                Promise.resolve('b'),
                Promise.resolve('c'),
            ];
            const results = await (0, async_1.asyncAllSettled)(promises);
            (0, vitest_1.expect)(results.every(r => r.success)).toBe(true);
        });
        (0, vitest_1.it)('should handle all failed promises', async () => {
            const promises = [
                Promise.reject(new Error('e1')),
                Promise.reject(new Error('e2')),
            ];
            const results = await (0, async_1.asyncAllSettled)(promises);
            (0, vitest_1.expect)(results.every(r => !r.success)).toBe(true);
        });
    });
    (0, vitest_1.describe)('asyncBatch', () => {
        (0, vitest_1.it)('should process items in batches', async () => {
            const items = [1, 2, 3, 4, 5, 6, 7];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => n * 2);
            const results = await (0, async_1.asyncBatch)(items, fn, 3);
            (0, vitest_1.expect)(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(7);
        });
        (0, vitest_1.it)('should delay between batches', async () => {
            const items = [1, 2, 3, 4];
            const fn = vitest_1.vi.fn().mockResolvedValue(true);
            const promise = (0, async_1.asyncBatch)(items, fn, 2, 100);
            // First batch processes immediately
            await Promise.resolve();
            // Wait for delay between batches
            await vitest_1.vi.advanceTimersByTimeAsync(100);
            await promise;
            (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(4);
        });
        (0, vitest_1.it)('should preserve order', async () => {
            const items = [1, 2, 3, 4, 5];
            const fn = vitest_1.vi.fn().mockImplementation(async (n) => n * 2);
            const results = await (0, async_1.asyncBatch)(items, fn, 2);
            (0, vitest_1.expect)(results).toEqual([2, 4, 6, 8, 10]);
        });
    });
});
//# sourceMappingURL=async.test.js.map