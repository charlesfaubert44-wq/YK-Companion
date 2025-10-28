/**
 * Async and Promise utilities for YK Companion
 * Provides reusable async patterns, error handling, and concurrency control
 */
/**
 * Result type for safe async operations
 * Inspired by Rust's Result<T, E> pattern
 */
export type AsyncResult<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
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
export declare function safeAsync<T, E = Error>(promise: Promise<T> | (() => Promise<T>)): Promise<AsyncResult<T, E>>;
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
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    onRetry?: (error: Error, attempt: number) => void;
}): Promise<T>;
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
export declare function asyncPool<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>, concurrencyLimit?: number): Promise<R[]>;
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
export declare function asyncSequential<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]>;
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
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutError?: string): Promise<T>;
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
export declare function debounceAsync<T extends (...args: any[]) => Promise<any>>(fn: T, delayMs: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
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
export declare function throttleAsync<T extends (...args: any[]) => Promise<any>>(fn: T, delayMs: number): (...args: Parameters<T>) => Promise<ReturnType<T> | null>;
/**
 * Create a promise that resolves after specified delay
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * @example
 * await sleep(1000); // Wait 1 second
 * console.log('1 second later');
 */
export declare function sleep(ms: number): Promise<void>;
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
export declare function pollUntil<T>(fn: () => Promise<T>, condition: (value: T) => boolean, options?: {
    interval?: number;
    timeout?: number;
    onPoll?: (value: T, attempt: number) => void;
}): Promise<T>;
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
export declare function asyncCache<T extends (...args: any[]) => Promise<any>>(fn: T, ttlMs: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
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
export declare function asyncAllSettled<T>(promises: Promise<T>[]): Promise<AsyncResult<T>[]>;
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
export declare function asyncBatch<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>, batchSize: number, delayBetweenBatches?: number): Promise<R[]>;
//# sourceMappingURL=async.d.ts.map