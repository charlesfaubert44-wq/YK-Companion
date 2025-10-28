/**
 * API Retry Logic with Exponential Backoff
 *
 * Architecture Reference: Arc42 Section 4.2 - Reliability Strategy
 * Implements automatic retries with exponential backoff to handle transient failures
 *
 * Use this for API calls that might fail due to:
 * - Network issues
 * - Temporary server unavailability
 * - Rate limiting
 *
 * @example
 * const data = await retryWithBackoff(
 *   () => fetch('/api/garage-sales'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export interface RetryOptions {
    /**
     * Maximum number of retry attempts
     * @default 3
     */
    maxRetries?: number;
    /**
     * Initial delay in milliseconds before first retry
     * @default 1000 (1 second)
     */
    initialDelay?: number;
    /**
     * Multiplier for exponential backoff
     * @default 2 (delay doubles each time)
     */
    backoffMultiplier?: number;
    /**
     * Maximum delay in milliseconds
     * @default 30000 (30 seconds)
     */
    maxDelay?: number;
    /**
     * Function to determine if error should trigger retry
     * @default Retries on network errors and 5xx status codes
     */
    shouldRetry?: (error: any) => boolean;
    /**
     * Callback called before each retry
     */
    onRetry?: (attempt: number, error: any) => void;
}
/**
 * Retry a function with exponential backoff
 *
 * @param fn Function to retry
 * @param options Retry configuration options
 * @returns Promise that resolves with function result or rejects after all retries
 *
 * @example
 * // Simple usage
 * const data = await retryWithBackoff(() => fetchData());
 *
 * @example
 * // Custom configuration
 * const data = await retryWithBackoff(
 *   () => fetch('/api/endpoint').then(r => r.json()),
 *   {
 *     maxRetries: 5,
 *     initialDelay: 500,
 *     onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
 *   }
 * );
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
/**
 * Create a wrapped function with built-in retry logic
 *
 * @param fn Function to wrap
 * @param options Retry configuration options
 * @returns Wrapped function with retry logic
 *
 * @example
 * const fetchWithRetry = withRetry(
 *   (id: string) => fetch(`/api/items/${id}`).then(r => r.json())
 * );
 *
 * // Now use it anywhere
 * const item = await fetchWithRetry('123');
 */
export declare function withRetry<Args extends any[], Return>(fn: (...args: Args) => Promise<Return>, options?: RetryOptions): (...args: Args) => Promise<Return>;
/**
 * Retry utility specifically for fetch requests
 *
 * @param input Fetch input (URL or Request)
 * @param init Fetch init options
 * @param retryOptions Retry configuration
 * @returns Fetch Response
 *
 * @example
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'value' })
 * });
 */
export declare function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, retryOptions?: RetryOptions): Promise<Response>;
//# sourceMappingURL=retry.d.ts.map