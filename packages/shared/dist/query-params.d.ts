/**
 * Query parameter and URL utilities for YK Companion
 * Provides type-safe URL manipulation and query string handling
 */
/**
 * Parse query string into typed object
 * @param queryString - Query string (with or without leading '?')
 * @returns Object with parsed parameters
 * @example
 * const params = parseQueryString('?search=furniture&tags=tools&tags=outdoor&limit=10');
 * // { search: 'furniture', tags: ['tools', 'outdoor'], limit: '10' }
 */
export declare function parseQueryString(queryString: string): Record<string, string | string[]>;
/**
 * Build query string from object
 * @param params - Object with parameters
 * @param options - Formatting options
 * @returns Query string (with leading '?')
 * @example
 * const qs = buildQueryString({ search: 'furniture', tags: ['tools', 'outdoor'], page: 1 });
 * // "?search=furniture&tags=tools&tags=outdoor&page=1"
 */
export declare function buildQueryString(params: Record<string, any>, options?: {
    arrayFormat?: 'repeat' | 'brackets' | 'comma';
    skipNull?: boolean;
    skipEmpty?: boolean;
    sort?: boolean;
}): string;
/**
 * Update query parameters in a URL
 * @param url - Base URL
 * @param updates - Parameters to add/update
 * @param remove - Parameter keys to remove
 * @returns Updated URL string
 * @example
 * const newUrl = updateQueryParams(
 *   '/garage-sales?page=1&limit=10',
 *   { page: 2, search: 'furniture' },
 *   ['limit']
 * );
 * // "/garage-sales?page=2&search=furniture"
 */
export declare function updateQueryParams(url: string, updates: Record<string, any>, remove?: string[]): string;
/**
 * Get a specific query parameter value
 * @param queryString - Query string or full URL
 * @param param - Parameter name
 * @returns Parameter value or null
 * @example
 * const search = getQueryParam(window.location.search, 'search');
 * const page = getQueryParam('/sales?page=2', 'page'); // "2"
 */
export declare function getQueryParam(queryString: string, param: string): string | null;
/**
 * Get all values for a query parameter (useful for arrays)
 * @param queryString - Query string or full URL
 * @param param - Parameter name
 * @returns Array of values
 * @example
 * const tags = getQueryParamArray('?tags=tools&tags=outdoor', 'tags');
 * // ['tools', 'outdoor']
 */
export declare function getQueryParamArray(queryString: string, param: string): string[];
/**
 * Remove a query parameter from URL
 * @param url - URL string
 * @param param - Parameter name to remove
 * @returns Updated URL
 * @example
 * const newUrl = removeQueryParam('/sales?search=furniture&page=1', 'page');
 * // "/sales?search=furniture"
 */
export declare function removeQueryParam(url: string, param: string): string;
/**
 * Check if URL has a specific query parameter
 * @param url - URL string
 * @param param - Parameter name
 * @returns True if parameter exists
 * @example
 * if (hasQueryParam(window.location.href, 'filter')) {
 *   // Apply filter
 * }
 */
export declare function hasQueryParam(url: string, param: string): boolean;
/**
 * Parse typed query parameters with defaults and validation
 * @param queryString - Query string
 * @param schema - Schema with types and defaults
 * @returns Typed and validated parameters
 * @example
 * const params = parseTypedQueryParams(location.search, {
 *   search: { type: 'string', default: '' },
 *   page: { type: 'number', default: 1, min: 1 },
 *   tags: { type: 'array', default: [] },
 *   active: { type: 'boolean', default: true }
 * });
 * // All parameters are properly typed and validated
 */
export declare function parseTypedQueryParams<T extends Record<string, any>>(queryString: string, schema: {
    [K in keyof T]: {
        type: 'string' | 'number' | 'boolean' | 'array';
        default: T[K];
        min?: number;
        max?: number;
        enum?: readonly any[];
    };
}): T;
/**
 * Merge multiple query strings
 * Later parameters override earlier ones
 * @param queryStrings - Array of query strings
 * @returns Merged query string
 * @example
 * const merged = mergeQueryStrings(
 *   '?page=1&limit=10',
 *   '?page=2&search=tools',
 *   '?limit=20'
 * );
 * // "?page=2&limit=20&search=tools"
 */
export declare function mergeQueryStrings(...queryStrings: string[]): string;
/**
 * Create a URL-safe slug from text
 * @param text - Text to slugify
 * @param options - Slugify options
 * @returns URL-safe slug
 * @example
 * const slug = slugify('Garage Sale - Furniture & Tools!');
 * // "garage-sale-furniture-tools"
 */
export declare function slugify(text: string, options?: {
    separator?: string;
    lowercase?: boolean;
    maxLength?: number;
}): string;
/**
 * Encode object to base64 URL-safe string
 * Useful for encoding filter state in URLs
 * @param obj - Object to encode
 * @returns Base64 encoded string
 * @example
 * const encoded = encodeObjectToUrl({ filters: { tags: ['tools'] }, sort: 'date' });
 * const url = `/sales?state=${encoded}`;
 */
export declare function encodeObjectToUrl(obj: any): string;
/**
 * Decode base64 URL-safe string to object
 * @param encoded - Encoded string
 * @returns Decoded object or null if invalid
 * @example
 * const state = decodeUrlToObject(params.get('state'));
 * if (state) applyFilters(state.filters);
 */
export declare function decodeUrlToObject<T = any>(encoded: string): T | null;
/**
 * Build a paginated URL
 * @param baseUrl - Base URL
 * @param page - Page number
 * @param pageSize - Items per page
 * @param additionalParams - Additional query parameters
 * @returns Paginated URL
 * @example
 * const url = buildPaginatedUrl('/garage-sales', 2, 20, { search: 'furniture' });
 * // "/garage-sales?page=2&limit=20&search=furniture"
 */
export declare function buildPaginatedUrl(baseUrl: string, page: number, pageSize: number, additionalParams?: Record<string, any>): string;
/**
 * Extract pagination info from query parameters
 * @param queryString - Query string
 * @param defaultPageSize - Default page size
 * @returns Pagination info
 * @example
 * const { page, limit, offset } = getPaginationFromQuery(location.search, 20);
 * // Use in API call
 */
export declare function getPaginationFromQuery(queryString: string, defaultPageSize?: number): {
    page: number;
    limit: number;
    offset: number;
};
//# sourceMappingURL=query-params.d.ts.map