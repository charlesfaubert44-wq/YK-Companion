"use strict";
/**
 * Async and Promise utilities for YK Companion
 * Provides reusable async patterns, error handling, and concurrency control
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeAsync = safeAsync;
exports.retryWithBackoff = retryWithBackoff;
exports.asyncPool = asyncPool;
exports.asyncSequential = asyncSequential;
exports.withTimeout = withTimeout;
exports.debounceAsync = debounceAsync;
exports.throttleAsync = throttleAsync;
exports.sleep = sleep;
exports.pollUntil = pollUntil;
exports.asyncCache = asyncCache;
exports.asyncAllSettled = asyncAllSettled;
exports.asyncBatch = asyncBatch;
/**
 * Safely execute an async function and return a Result type
 * Prevents uncaught promise rejections and makes error handling explicit
 * @param promise - Promise or async function to execute
 * @returns AsyncResult with success/error status
 * @example
 * const result = await safeAsync(() => fetchUserData(userId));
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
async function safeAsync(promise) {
    try {
        const data = await (typeof promise === 'function' ? promise() : promise);
        return { success: true, data };
    }
    catch (error) {
        return { success: false, error: error };
    }
}
/**
 * Retry an async function with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Promise with the result
 * @throws Last error if all retries fail
 * @example
 * const data = await retryWithBackoff(
 *   () => fetch('/api/data'),
 *   { maxRetries: 3, initialDelay: 1000, maxDelay: 10000 }
 * );
 */
async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, backoffMultiplier = 2, onRetry, } = options;
    let lastError;
    let delay = initialDelay;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                onRetry?.(lastError, attempt + 1);
                await sleep(delay);
                delay = Math.min(delay * backoffMultiplier, maxDelay);
            }
        }
    }
    throw lastError;
}
/**
 * Execute multiple async functions in parallel with concurrency limit
 * Prevents overwhelming the system with too many concurrent requests
 * @param items - Array of items to process
 * @param fn - Async function to execute for each item
 * @param concurrencyLimit - Maximum number of concurrent executions
 * @returns Array of results
 * @example
 * const sales = await asyncPool(
 *   saleIds,
 *   (id) => fetchGarageSale(id),
 *   5 // Max 5 concurrent requests
 * );
 */
async function asyncPool(items, fn, concurrencyLimit = 5) {
    const results = [];
    const executing = [];
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const promise = (async () => {
            const result = await fn(item, index);
            results[index] = result;
        })();
        executing.push(promise);
        if (executing.length >= concurrencyLimit) {
            await Promise.race(executing);
            executing.splice(executing.findIndex((p) => p === promise), 1);
        }
    }
    await Promise.all(executing);
    return results;
}
/**
 * Execute async functions sequentially (one after another)
 * Useful when order matters or to avoid rate limiting
 * @param items - Array of items to process
 * @param fn - Async function to execute for each item
 * @returns Array of results
 * @example
 * const results = await asyncSequential(
 *   apiCalls,
 *   (call) => call()
 * );
 */
async function asyncSequential(items, fn) {
    const results = [];
    for (let i = 0; i < items.length; i++) {
        results.push(await fn(items[i], i));
    }
    return results;
}
/**
 * Race multiple promises with a timeout
 * @param promise - Promise to race
 * @param timeoutMs - Timeout in milliseconds
 * @param timeoutError - Optional custom error message
 * @returns Promise result or throws timeout error
 * @example
 * const data = await withTimeout(
 *   fetchLargeDataset(),
 *   5000,
 *   'Data fetch took too long'
 * );
 */
async function withTimeout(promise, timeoutMs, timeoutError = 'Operation timed out') {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(timeoutError)), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
}
/**
 * Debounced async function that cancels previous calls
 * Useful for search inputs and auto-save features
 * @param fn - Async function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounceAsync(
 *   (query: string) => searchGarageSales(query),
 *   300
 * );
 * debouncedSearch('furniture'); // Only executes after 300ms of no calls
 */
function debounceAsync(fn, delayMs) {
    let timeoutId = null;
    let latestReject = null;
    return (...args) => {
        return new Promise((resolve, reject) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                latestReject?.(new Error('Debounced call cancelled'));
            }
            latestReject = reject;
            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn(...args);
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }, delayMs);
        });
    };
}
/**
 * Throttled async function that limits execution rate
 * Different from debounce: executes immediately, then blocks for delay
 * @param fn - Async function to throttle
 * @param delayMs - Minimum delay between executions
 * @returns Throttled function
 * @example
 * const throttledSave = throttleAsync(
 *   (data) => saveToDatabase(data),
 *   2000 // Max once per 2 seconds
 * );
 */
function throttleAsync(fn, delayMs) {
    let lastExecuted = 0;
    let isExecuting = false;
    return async (...args) => {
        const now = Date.now();
        if (isExecuting || now - lastExecuted < delayMs) {
            return null;
        }
        isExecuting = true;
        lastExecuted = now;
        try {
            return await fn(...args);
        }
        finally {
            isExecuting = false;
        }
    };
}
/**
 * Create a promise that resolves after specified delay
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * @example
 * await sleep(1000); // Wait 1 second
 * console.log('1 second later');
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Poll an async function until a condition is met or timeout occurs
 * @param fn - Function that returns the value to check
 * @param condition - Function that tests the value
 * @param options - Polling configuration
 * @returns Promise with the final value
 * @throws Error if timeout is reached
 * @example
 * const jobResult = await pollUntil(
 *   () => checkJobStatus(jobId),
 *   (status) => status === 'completed',
 *   { interval: 1000, timeout: 30000 }
 * );
 */
async function pollUntil(fn, condition, options = {}) {
    const { interval = 1000, timeout = 30000, onPoll } = options;
    const startTime = Date.now();
    let attempt = 0;
    while (true) {
        const value = await fn();
        attempt++;
        onPoll?.(value, attempt);
        if (condition(value)) {
            return value;
        }
        if (Date.now() - startTime >= timeout) {
            throw new Error(`Polling timed out after ${timeout}ms`);
        }
        await sleep(interval);
    }
}
/**
 * Cache the result of an async function for a specified duration
 * Useful for expensive API calls or computations
 * @param fn - Async function to cache
 * @param ttlMs - Time to live in milliseconds
 * @returns Cached function
 * @example
 * const getCachedWeather = asyncCache(
 *   () => fetchWeatherData(),
 *   5 * 60 * 1000 // Cache for 5 minutes
 * );
 * const weather = await getCachedWeather(); // Fetches fresh data
 * const weather2 = await getCachedWeather(); // Returns cached data
 */
function asyncCache(fn, ttlMs) {
    const cache = new Map();
    return async (...args) => {
        const key = JSON.stringify(args);
        const cached = cache.get(key);
        if (cached && Date.now() < cached.expiry) {
            return cached.value;
        }
        const value = await fn(...args);
        cache.set(key, { value, expiry: Date.now() + ttlMs });
        return value;
    };
}
/**
 * Execute multiple promises and return all results (including errors)
 * Unlike Promise.all(), doesn't fail fast - waits for all to complete
 * @param promises - Array of promises
 * @returns Array of AsyncResults
 * @example
 * const results = await asyncAllSettled([
 *   fetchUserData(),
 *   fetchPreferences(),
 *   fetchActivities()
 * ]);
 * // All results available, even if some failed
 * results.forEach(result => {
 *   if (result.success) console.log(result.data);
 *   else console.error(result.error);
 * });
 */
async function asyncAllSettled(promises) {
    const results = await Promise.allSettled(promises);
    return results.map((result) => {
        if (result.status === 'fulfilled') {
            return { success: true, data: result.value };
        }
        else {
            return { success: false, error: result.reason };
        }
    });
}
/**
 * Batch async operations into groups and execute sequentially
 * Combines the benefits of parallel and sequential execution
 * @param items - Items to process
 * @param fn - Async function for each item
 * @param batchSize - Number of items per batch
 * @param delayBetweenBatches - Optional delay between batches (ms)
 * @returns Array of all results
 * @example
 * const emails = await asyncBatch(
 *   users,
 *   (user) => sendEmail(user),
 *   10, // Process 10 at a time
 *   1000 // Wait 1s between batches
 * );
 */
async function asyncBatch(items, fn, batchSize, delayBetweenBatches = 0) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((item, index) => fn(item, i + index)));
        results.push(...batchResults);
        if (delayBetweenBatches > 0 && i + batchSize < items.length) {
            await sleep(delayBetweenBatches);
        }
    }
    return results;
}
//# sourceMappingURL=async.js.map