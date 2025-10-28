"use strict";
/**
 * Query parameter and URL utilities for YK Companion
 * Provides type-safe URL manipulation and query string handling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = parseQueryString;
exports.buildQueryString = buildQueryString;
exports.updateQueryParams = updateQueryParams;
exports.getQueryParam = getQueryParam;
exports.getQueryParamArray = getQueryParamArray;
exports.removeQueryParam = removeQueryParam;
exports.hasQueryParam = hasQueryParam;
exports.parseTypedQueryParams = parseTypedQueryParams;
exports.mergeQueryStrings = mergeQueryStrings;
exports.slugify = slugify;
exports.encodeObjectToUrl = encodeObjectToUrl;
exports.decodeUrlToObject = decodeUrlToObject;
exports.buildPaginatedUrl = buildPaginatedUrl;
exports.getPaginationFromQuery = getPaginationFromQuery;
/**
 * Parse query string into typed object
 * @param queryString - Query string (with or without leading '?')
 * @returns Object with parsed parameters
 * @example
 * const params = parseQueryString('?search=furniture&tags=tools&tags=outdoor&limit=10');
 * // { search: 'furniture', tags: ['tools', 'outdoor'], limit: '10' }
 */
function parseQueryString(queryString) {
    const params = {};
    const searchParams = new URLSearchParams(queryString.replace(/^\?/, ''));
    searchParams.forEach((value, key) => {
        const existing = params[key];
        if (existing) {
            // Convert to array if multiple values
            params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        }
        else {
            params[key] = value;
        }
    });
    return params;
}
/**
 * Build query string from object
 * @param params - Object with parameters
 * @param options - Formatting options
 * @returns Query string (with leading '?')
 * @example
 * const qs = buildQueryString({ search: 'furniture', tags: ['tools', 'outdoor'], page: 1 });
 * // "?search=furniture&tags=tools&tags=outdoor&page=1"
 */
function buildQueryString(params, options = {}) {
    const { arrayFormat = 'repeat', skipNull = true, skipEmpty = true, sort = false } = options;
    const searchParams = new URLSearchParams();
    const keys = sort ? Object.keys(params).sort() : Object.keys(params);
    keys.forEach((key) => {
        const value = params[key];
        // Skip null/undefined if configured
        if (skipNull && (value === null || value === undefined)) {
            return;
        }
        // Skip empty strings if configured
        if (skipEmpty && value === '') {
            return;
        }
        // Handle arrays
        if (Array.isArray(value)) {
            if (arrayFormat === 'comma') {
                searchParams.append(key, value.join(','));
            }
            else if (arrayFormat === 'brackets') {
                value.forEach((item) => searchParams.append(`${key}[]`, String(item)));
            }
            else {
                // 'repeat' format (default)
                value.forEach((item) => searchParams.append(key, String(item)));
            }
            return;
        }
        // Handle boolean
        if (typeof value === 'boolean') {
            searchParams.append(key, value ? 'true' : 'false');
            return;
        }
        // Handle other values
        searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
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
function updateQueryParams(url, updates, remove = []) {
    const [baseUrl, queryString] = url.split('?');
    const params = queryString ? parseQueryString(queryString) : {};
    // Remove specified parameters
    remove.forEach((key) => delete params[key]);
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            delete params[key];
        }
        else {
            params[key] = value;
        }
    });
    const newQueryString = buildQueryString(params);
    return baseUrl + newQueryString;
}
/**
 * Get a specific query parameter value
 * @param queryString - Query string or full URL
 * @param param - Parameter name
 * @returns Parameter value or null
 * @example
 * const search = getQueryParam(window.location.search, 'search');
 * const page = getQueryParam('/sales?page=2', 'page'); // "2"
 */
function getQueryParam(queryString, param) {
    const params = parseQueryString(queryString);
    const value = params[param];
    return Array.isArray(value) ? value[0] : value || null;
}
/**
 * Get all values for a query parameter (useful for arrays)
 * @param queryString - Query string or full URL
 * @param param - Parameter name
 * @returns Array of values
 * @example
 * const tags = getQueryParamArray('?tags=tools&tags=outdoor', 'tags');
 * // ['tools', 'outdoor']
 */
function getQueryParamArray(queryString, param) {
    const params = parseQueryString(queryString);
    const value = params[param];
    return Array.isArray(value) ? value : value ? [value] : [];
}
/**
 * Remove a query parameter from URL
 * @param url - URL string
 * @param param - Parameter name to remove
 * @returns Updated URL
 * @example
 * const newUrl = removeQueryParam('/sales?search=furniture&page=1', 'page');
 * // "/sales?search=furniture"
 */
function removeQueryParam(url, param) {
    return updateQueryParams(url, {}, [param]);
}
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
function hasQueryParam(url, param) {
    return getQueryParam(url, param) !== null;
}
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
function parseTypedQueryParams(queryString, schema) {
    const params = parseQueryString(queryString);
    const result = {};
    for (const key in schema) {
        const config = schema[key];
        const rawValue = params[key];
        // Use default if not present
        if (rawValue === undefined) {
            result[key] = config.default;
            continue;
        }
        // Parse based on type
        switch (config.type) {
            case 'string': {
                const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
                result[key] = (config.enum ? (config.enum.includes(value) ? value : config.default) : value);
                break;
            }
            case 'number': {
                const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
                let num = parseFloat(value);
                if (isNaN(num))
                    num = config.default;
                if (config.min !== undefined)
                    num = Math.max(num, config.min);
                if (config.max !== undefined)
                    num = Math.min(num, config.max);
                result[key] = num;
                break;
            }
            case 'boolean': {
                const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
                result[key] = (value === 'true' || value === '1');
                break;
            }
            case 'array': {
                const values = Array.isArray(rawValue) ? rawValue : [rawValue];
                result[key] = (config.enum ? values.filter((v) => config.enum.includes(v)) : values);
                break;
            }
        }
    }
    return result;
}
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
function mergeQueryStrings(...queryStrings) {
    const merged = {};
    queryStrings.forEach((qs) => {
        const params = parseQueryString(qs);
        Object.assign(merged, params);
    });
    return buildQueryString(merged);
}
/**
 * Create a URL-safe slug from text
 * @param text - Text to slugify
 * @param options - Slugify options
 * @returns URL-safe slug
 * @example
 * const slug = slugify('Garage Sale - Furniture & Tools!');
 * // "garage-sale-furniture-tools"
 */
function slugify(text, options = {}) {
    const { separator = '-', lowercase = true, maxLength } = options;
    let slug = text
        .toString()
        .normalize('NFD') // Normalize to decomposed form
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, separator) // Replace spaces with separator
        .replace(new RegExp(`${separator}+`, 'g'), separator) // Remove duplicate separators
        .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Trim separators
    if (lowercase) {
        slug = slug.toLowerCase();
    }
    if (maxLength && slug.length > maxLength) {
        slug = slug.substring(0, maxLength).replace(new RegExp(`${separator}$`), '');
    }
    return slug;
}
/**
 * Encode object to base64 URL-safe string
 * Useful for encoding filter state in URLs
 * @param obj - Object to encode
 * @returns Base64 encoded string
 * @example
 * const encoded = encodeObjectToUrl({ filters: { tags: ['tools'] }, sort: 'date' });
 * const url = `/sales?state=${encoded}`;
 */
function encodeObjectToUrl(obj) {
    const json = JSON.stringify(obj);
    const base64 = btoa(json);
    // Make URL-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
/**
 * Decode base64 URL-safe string to object
 * @param encoded - Encoded string
 * @returns Decoded object or null if invalid
 * @example
 * const state = decodeUrlToObject(params.get('state'));
 * if (state) applyFilters(state.filters);
 */
function decodeUrlToObject(encoded) {
    try {
        // Restore standard base64
        const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        const padded = base64 + '=='.substring(0, (4 - (base64.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    }
    catch {
        return null;
    }
}
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
function buildPaginatedUrl(baseUrl, page, pageSize, additionalParams = {}) {
    const params = {
        page: page.toString(),
        limit: pageSize.toString(),
        ...additionalParams,
    };
    return baseUrl + buildQueryString(params);
}
/**
 * Extract pagination info from query parameters
 * @param queryString - Query string
 * @param defaultPageSize - Default page size
 * @returns Pagination info
 * @example
 * const { page, limit, offset } = getPaginationFromQuery(location.search, 20);
 * // Use in API call
 */
function getPaginationFromQuery(queryString, defaultPageSize = 20) {
    const params = parseQueryString(queryString);
    const page = Math.max(1, parseInt((Array.isArray(params.page) ? params.page[0] : params.page) || '1', 10));
    const limit = Math.max(1, parseInt((Array.isArray(params.limit) ? params.limit[0] : params.limit) || String(defaultPageSize), 10));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
//# sourceMappingURL=query-params.js.map