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
 * Default retry predicate - retries on network errors and server errors (5xx)
 */
const defaultShouldRetry = (error: any): boolean => {
  // Retry on network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }

  // Retry on 5xx server errors
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    return true;
  }

  // Retry on 429 (Too Many Requests)
  if (error?.response?.status === 429) {
    return true;
  }

  // Don't retry on client errors (4xx) or success codes
  return false;
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffMultiplier = 2,
    maxDelay = 30000,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Try to execute the function
      return await fn();
    } catch (error) {
      lastError = error;

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // Log retry in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
          error
        );
      }

      // Wait before retrying
      await sleep(delay);

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError;
}

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
export function withRetry<Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  options: RetryOptions = {}
): (...args: Args) => Promise<Return> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options);
}

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
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(
    async () => {
      const response = await fetch(input, init);

      // Throw error for non-ok responses to trigger retry logic
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = response;
        throw error;
      }

      return response;
    },
    retryOptions
  );
}
