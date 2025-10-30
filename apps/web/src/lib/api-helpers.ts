/**
 * API Helper utilities for YK Buddy
 * Provides reusable functions for API requests, error handling, and data fetching
 */

/**
 * API Response type
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * Fetch options with common defaults
 */
export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Make a GET request with error handling and timeout
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise with ApiResponse
 * @example
 * const result = await apiGet('/api/garage-sales');
 * if (result.error) console.error(result.error);
 * else console.log(result.data);
 */
export async function apiGet<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Make a POST request with error handling
 * @param url - URL to post to
 * @param data - Data to send in request body
 * @param options - Fetch options
 * @returns Promise with ApiResponse
 * @example
 * const result = await apiPost('/api/knowledge', { title: 'New tip', content: '...' });
 */
export async function apiPost<T = any>(
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make a PUT request with error handling
 * @param url - URL to put to
 * @param data - Data to send in request body
 * @param options - Fetch options
 * @returns Promise with ApiResponse
 * @example
 * const result = await apiPut('/api/garage-sales/123', { title: 'Updated title' });
 */
export async function apiPut<T = any>(
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make a PATCH request with error handling
 * @param url - URL to patch
 * @param data - Data to send in request body
 * @param options - Fetch options
 * @returns Promise with ApiResponse
 * @example
 * const result = await apiPatch('/api/garage-sales/123', { status: 'completed' });
 */
export async function apiPatch<T = any>(
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make a DELETE request with error handling
 * @param url - URL to delete
 * @param options - Fetch options
 * @returns Promise with ApiResponse
 * @example
 * const result = await apiDelete('/api/garage-sales/123');
 */
export async function apiDelete<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

/**
 * Core API request function with timeout and retry logic
 * @param url - URL to fetch
 * @param options - Fetch options with timeout and retries
 * @returns Promise with ApiResponse
 */
async function apiRequest<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, retries = 0, ...fetchOptions } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: T | undefined;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        data = json.data || json;
      }

      if (!response.ok) {
        return {
          status: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data,
        };
      }

      return {
        status: response.status,
        data,
      };
    } catch (error: any) {
      lastError = error;

      // Don't retry on abort
      if (error.name === 'AbortError') {
        return {
          status: 408,
          error: `Request timeout after ${timeout}ms`,
        };
      }

      // If this is the last retry, return error
      if (attempt === retries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    status: 0,
    error: lastError?.message || 'Network error',
  };
}

/**
 * Build a query string from an object
 * @param params - Object with query parameters
 * @returns Query string (e.g., "?key1=value1&key2=value2")
 * @example
 * buildQueryString({ search: 'furniture', limit: 10 }) // "?search=furniture&limit=10"
 * buildQueryString({ tags: ['tools', 'outdoor'] }) // "?tags=tools&tags=outdoor"
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Handle API errors with user-friendly messages
 * @param error - Error from API request
 * @returns User-friendly error message
 * @example
 * const message = handleApiError({ status: 404, error: 'Not found' });
 * // "The requested resource was not found"
 */
export function handleApiError(error: ApiResponse): string {
  const { status, error: errorMessage } = error;

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'You must be logged in to perform this action.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'Request timeout. Please try again.';
    case 409:
      return 'This resource already exists or conflicts with another.';
    case 429:
      return 'Too many requests. Please slow down and try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return errorMessage || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Check if a response is successful (2xx status code)
 * @param response - API response
 * @returns True if response is successful
 * @example
 * if (isSuccessResponse(result)) {
 *   console.log('Success!', result.data);
 * }
 */
export function isSuccessResponse(response: ApiResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

/**
 * Retry a failed request with exponential backoff
 * @param fn - Function that returns a promise
 * @param retries - Number of retries
 * @param delay - Initial delay in ms
 * @returns Promise with result
 * @example
 * const data = await retryRequest(() => apiGet('/api/data'), 3, 1000);
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;

    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

/**
 * Create a paginated API request helper
 * @param baseUrl - Base URL for the API endpoint
 * @param limit - Items per page
 * @returns Function to fetch a specific page
 * @example
 * const fetchPage = createPaginatedFetcher('/api/garage-sales', 20);
 * const page1 = await fetchPage(0); // Offset 0
 * const page2 = await fetchPage(1); // Offset 20
 */
export function createPaginatedFetcher<T = any>(baseUrl: string, limit: number = 20) {
  return async (
    page: number,
    additionalParams: Record<string, any> = {}
  ): Promise<ApiResponse<T>> => {
    const offset = page * limit;
    const queryString = buildQueryString({ ...additionalParams, limit, offset });
    return apiGet<T>(`${baseUrl}${queryString}`);
  };
}

/**
 * Batch multiple API requests and handle them together
 * @param requests - Array of request promises
 * @returns Promise that resolves when all requests complete
 * @example
 * const results = await batchRequests([
 *   apiGet('/api/sales'),
 *   apiGet('/api/events'),
 *   apiGet('/api/sponsors')
 * ]);
 */
export async function batchRequests<T = any>(
  requests: Promise<ApiResponse<T>>[]
): Promise<ApiResponse<T>[]> {
  return Promise.all(requests);
}

/**
 * Upload a file with progress tracking
 * @param url - Upload URL
 * @param file - File to upload
 * @param onProgress - Progress callback (percentage)
 * @returns Promise with ApiResponse
 * @example
 * await uploadFile('/api/upload', file, (progress) => {
 *   console.log(`Upload ${progress}% complete`);
 * });
 */
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ status: xhr.status, data });
        } catch {
          resolve({ status: xhr.status, data: xhr.responseText });
        }
      } else {
        resolve({ status: xhr.status, error: `Upload failed: ${xhr.statusText}` });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ status: 0, error: 'Network error during upload' });
    });

    xhr.open('POST', url);
    xhr.send(formData);
  });
}
