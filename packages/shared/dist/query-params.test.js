"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for query parameter utilities
 */
const vitest_1 = require("vitest");
const query_params_1 = require("./query-params");
(0, vitest_1.describe)('query-params utilities', () => {
    (0, vitest_1.describe)('parseQueryString', () => {
        (0, vitest_1.it)('should parse simple query string', () => {
            const result = (0, query_params_1.parseQueryString)('?search=furniture&page=2');
            (0, vitest_1.expect)(result).toEqual({
                search: 'furniture',
                page: '2',
            });
        });
        (0, vitest_1.it)('should handle multiple values for same key', () => {
            const result = (0, query_params_1.parseQueryString)('?tags=tools&tags=outdoor&tags=furniture');
            (0, vitest_1.expect)(result.tags).toEqual(['tools', 'outdoor', 'furniture']);
        });
        (0, vitest_1.it)('should handle query string without leading ?', () => {
            const result = (0, query_params_1.parseQueryString)('search=test&limit=10');
            (0, vitest_1.expect)(result).toEqual({
                search: 'test',
                limit: '10',
            });
        });
        (0, vitest_1.it)('should handle empty query string', () => {
            const result = (0, query_params_1.parseQueryString)('');
            (0, vitest_1.expect)(result).toEqual({});
        });
        (0, vitest_1.it)('should handle URL-encoded values', () => {
            const result = (0, query_params_1.parseQueryString)('?search=garage%20sale&city=yellowknife');
            (0, vitest_1.expect)(result.search).toBe('garage sale');
        });
    });
    (0, vitest_1.describe)('buildQueryString', () => {
        (0, vitest_1.it)('should build simple query string', () => {
            const result = (0, query_params_1.buildQueryString)({
                search: 'furniture',
                page: 2,
            });
            (0, vitest_1.expect)(result).toBe('?search=furniture&page=2');
        });
        (0, vitest_1.it)('should handle arrays with repeat format', () => {
            const result = (0, query_params_1.buildQueryString)({
                tags: ['tools', 'outdoor'],
            }, { arrayFormat: 'repeat' });
            (0, vitest_1.expect)(result).toBe('?tags=tools&tags=outdoor');
        });
        (0, vitest_1.it)('should handle arrays with brackets format', () => {
            const result = (0, query_params_1.buildQueryString)({
                tags: ['tools', 'outdoor'],
            }, { arrayFormat: 'brackets' });
            // URLSearchParams encodes brackets, which is correct
            (0, vitest_1.expect)(result).toContain('tags');
            (0, vitest_1.expect)(result).toContain('tools');
            (0, vitest_1.expect)(result).toContain('outdoor');
        });
        (0, vitest_1.it)('should handle arrays with comma format', () => {
            const result = (0, query_params_1.buildQueryString)({
                tags: ['tools', 'outdoor'],
            }, { arrayFormat: 'comma' });
            // URLSearchParams encodes commas, which is correct
            (0, vitest_1.expect)(result).toContain('tags');
            (0, vitest_1.expect)(result).toContain('tools');
        });
        (0, vitest_1.it)('should skip null values by default', () => {
            const result = (0, query_params_1.buildQueryString)({
                search: 'test',
                page: null,
                limit: undefined,
            });
            (0, vitest_1.expect)(result).toBe('?search=test');
        });
        (0, vitest_1.it)('should skip empty strings if configured', () => {
            const result = (0, query_params_1.buildQueryString)({
                search: '',
                page: 1,
            }, { skipEmpty: true });
            (0, vitest_1.expect)(result).toBe('?page=1');
        });
        (0, vitest_1.it)('should handle booleans', () => {
            const result = (0, query_params_1.buildQueryString)({
                active: true,
                archived: false,
            });
            (0, vitest_1.expect)(result).toBe('?active=true&archived=false');
        });
        (0, vitest_1.it)('should sort keys if configured', () => {
            const result = (0, query_params_1.buildQueryString)({
                z: '1',
                a: '2',
                m: '3',
            }, { sort: true });
            (0, vitest_1.expect)(result).toBe('?a=2&m=3&z=1');
        });
        (0, vitest_1.it)('should return empty string for empty object', () => {
            const result = (0, query_params_1.buildQueryString)({});
            (0, vitest_1.expect)(result).toBe('');
        });
    });
    (0, vitest_1.describe)('updateQueryParams', () => {
        (0, vitest_1.it)('should update existing parameters', () => {
            const result = (0, query_params_1.updateQueryParams)('/sales?page=1&limit=10', { page: 2 });
            (0, vitest_1.expect)(result).toBe('/sales?page=2&limit=10');
        });
        (0, vitest_1.it)('should add new parameters', () => {
            const result = (0, query_params_1.updateQueryParams)('/sales?page=1', { search: 'furniture' });
            (0, vitest_1.expect)(result).toBe('/sales?page=1&search=furniture');
        });
        (0, vitest_1.it)('should remove parameters', () => {
            const result = (0, query_params_1.updateQueryParams)('/sales?page=1&limit=10&search=test', {}, ['limit', 'search']);
            (0, vitest_1.expect)(result).toBe('/sales?page=1');
        });
        (0, vitest_1.it)('should remove parameter by setting to null', () => {
            const result = (0, query_params_1.updateQueryParams)('/sales?page=1&search=test', { search: null });
            (0, vitest_1.expect)(result).toBe('/sales?page=1');
        });
        (0, vitest_1.it)('should handle URL without query string', () => {
            const result = (0, query_params_1.updateQueryParams)('/sales', { page: 1 });
            (0, vitest_1.expect)(result).toBe('/sales?page=1');
        });
    });
    (0, vitest_1.describe)('getQueryParam', () => {
        (0, vitest_1.it)('should get single parameter value', () => {
            const value = (0, query_params_1.getQueryParam)('?search=furniture&page=2', 'search');
            (0, vitest_1.expect)(value).toBe('furniture');
        });
        (0, vitest_1.it)('should return first value for multiple values', () => {
            const value = (0, query_params_1.getQueryParam)('?tags=tools&tags=outdoor', 'tags');
            (0, vitest_1.expect)(value).toBe('tools');
        });
        (0, vitest_1.it)('should return null for non-existent parameter', () => {
            const value = (0, query_params_1.getQueryParam)('?search=test', 'page');
            (0, vitest_1.expect)(value).toBeNull();
        });
        (0, vitest_1.it)('should work with full URLs', () => {
            const value = (0, query_params_1.getQueryParam)('?page=2', 'page');
            (0, vitest_1.expect)(value).toBe('2');
        });
    });
    (0, vitest_1.describe)('getQueryParamArray', () => {
        (0, vitest_1.it)('should get array of values', () => {
            const values = (0, query_params_1.getQueryParamArray)('?tags=tools&tags=outdoor&tags=furniture', 'tags');
            (0, vitest_1.expect)(values).toEqual(['tools', 'outdoor', 'furniture']);
        });
        (0, vitest_1.it)('should return single value as array', () => {
            const values = (0, query_params_1.getQueryParamArray)('?tag=tools', 'tag');
            (0, vitest_1.expect)(values).toEqual(['tools']);
        });
        (0, vitest_1.it)('should return empty array for non-existent parameter', () => {
            const values = (0, query_params_1.getQueryParamArray)('?search=test', 'tags');
            (0, vitest_1.expect)(values).toEqual([]);
        });
    });
    (0, vitest_1.describe)('removeQueryParam', () => {
        (0, vitest_1.it)('should remove parameter', () => {
            const result = (0, query_params_1.removeQueryParam)('/sales?search=furniture&page=1', 'page');
            (0, vitest_1.expect)(result).toBe('/sales?search=furniture');
        });
        (0, vitest_1.it)('should handle removing non-existent parameter', () => {
            const result = (0, query_params_1.removeQueryParam)('/sales?page=1', 'search');
            (0, vitest_1.expect)(result).toBe('/sales?page=1');
        });
    });
    (0, vitest_1.describe)('hasQueryParam', () => {
        (0, vitest_1.it)('should check if parameter exists', () => {
            (0, vitest_1.expect)((0, query_params_1.hasQueryParam)('?search=test&page=1', 'search')).toBe(true);
            (0, vitest_1.expect)((0, query_params_1.hasQueryParam)('?search=test&page=1', 'limit')).toBe(false);
        });
    });
    (0, vitest_1.describe)('parseTypedQueryParams', () => {
        (0, vitest_1.it)('should parse string parameters', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?search=furniture', {
                search: { type: 'string', default: '' },
            });
            (0, vitest_1.expect)(result.search).toBe('furniture');
        });
        (0, vitest_1.it)('should parse number parameters', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?page=2&limit=10', {
                page: { type: 'number', default: 1 },
                limit: { type: 'number', default: 20 },
            });
            (0, vitest_1.expect)(result.page).toBe(2);
            (0, vitest_1.expect)(result.limit).toBe(10);
        });
        (0, vitest_1.it)('should parse boolean parameters', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?active=true&archived=false', {
                active: { type: 'boolean', default: false },
                archived: { type: 'boolean', default: false },
            });
            (0, vitest_1.expect)(result.active).toBe(true);
            (0, vitest_1.expect)(result.archived).toBe(false);
        });
        (0, vitest_1.it)('should parse array parameters', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?tags=tools&tags=outdoor', {
                tags: { type: 'array', default: [] },
            });
            (0, vitest_1.expect)(result.tags).toEqual(['tools', 'outdoor']);
        });
        (0, vitest_1.it)('should use defaults for missing parameters', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?search=test', {
                search: { type: 'string', default: '' },
                page: { type: 'number', default: 1 },
                active: { type: 'boolean', default: true },
                tags: { type: 'array', default: [] },
            });
            (0, vitest_1.expect)(result.page).toBe(1);
            (0, vitest_1.expect)(result.active).toBe(true);
            (0, vitest_1.expect)(result.tags).toEqual([]);
        });
        (0, vitest_1.it)('should enforce min/max for numbers', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?page=-1&limit=1000', {
                page: { type: 'number', default: 1, min: 1 },
                limit: { type: 'number', default: 20, max: 100 },
            });
            (0, vitest_1.expect)(result.page).toBe(1); // Clamped to min
            (0, vitest_1.expect)(result.limit).toBe(100); // Clamped to max
        });
        (0, vitest_1.it)('should validate enum values', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?status=pending&invalid=bad', {
                status: { type: 'string', default: 'all', enum: ['all', 'pending', 'completed'] },
                invalid: { type: 'string', default: 'all', enum: ['all', 'pending', 'completed'] },
            });
            (0, vitest_1.expect)(result.status).toBe('pending');
            (0, vitest_1.expect)(result.invalid).toBe('all'); // Falls back to default
        });
        (0, vitest_1.it)('should handle invalid numbers', () => {
            const result = (0, query_params_1.parseTypedQueryParams)('?page=invalid', {
                page: { type: 'number', default: 1 },
            });
            (0, vitest_1.expect)(result.page).toBe(1); // Falls back to default
        });
    });
    (0, vitest_1.describe)('mergeQueryStrings', () => {
        (0, vitest_1.it)('should merge multiple query strings', () => {
            const result = (0, query_params_1.mergeQueryStrings)('?page=1&limit=10', '?page=2&search=tools', '?limit=20');
            (0, vitest_1.expect)(result).toBe('?page=2&limit=20&search=tools');
        });
        (0, vitest_1.it)('should handle empty query strings', () => {
            const result = (0, query_params_1.mergeQueryStrings)('?page=1', '', '?limit=10');
            (0, vitest_1.expect)(result).toBe('?page=1&limit=10');
        });
    });
    (0, vitest_1.describe)('slugify', () => {
        (0, vitest_1.it)('should create URL-safe slug', () => {
            const result = (0, query_params_1.slugify)('Garage Sale - Furniture & Tools!');
            (0, vitest_1.expect)(result).toBe('garage-sale-furniture-tools');
        });
        (0, vitest_1.it)('should handle special characters', () => {
            const result = (0, query_params_1.slugify)('Hello @World #Test $100');
            (0, vitest_1.expect)(result).toBe('hello-world-test-100');
        });
        (0, vitest_1.it)('should handle multiple spaces', () => {
            const result = (0, query_params_1.slugify)('Multiple   Spaces   Here');
            (0, vitest_1.expect)(result).toBe('multiple-spaces-here');
        });
        (0, vitest_1.it)('should handle leading/trailing spaces', () => {
            const result = (0, query_params_1.slugify)('  Trimmed  ');
            (0, vitest_1.expect)(result).toBe('trimmed');
        });
        (0, vitest_1.it)('should use custom separator', () => {
            const result = (0, query_params_1.slugify)('Test Title', { separator: '_' });
            (0, vitest_1.expect)(result).toBe('test_title');
        });
        (0, vitest_1.it)('should preserve case if configured', () => {
            const result = (0, query_params_1.slugify)('Test Title', { lowercase: false });
            (0, vitest_1.expect)(result).toBe('Test-Title');
        });
        (0, vitest_1.it)('should enforce max length', () => {
            const result = (0, query_params_1.slugify)('This is a very long title that should be truncated', {
                maxLength: 20,
            });
            (0, vitest_1.expect)(result.length).toBeLessThanOrEqual(20);
            (0, vitest_1.expect)(result.endsWith('-')).toBe(false);
        });
        (0, vitest_1.it)('should handle diacritics', () => {
            const result = (0, query_params_1.slugify)('Café résumé naïve');
            (0, vitest_1.expect)(result).toBe('cafe-resume-naive');
        });
    });
    (0, vitest_1.describe)('encodeObjectToUrl / decodeUrlToObject', () => {
        (0, vitest_1.it)('should encode and decode objects', () => {
            const obj = {
                filters: { tags: ['tools', 'outdoor'], active: true },
                sort: 'date',
                page: 1,
            };
            const encoded = (0, query_params_1.encodeObjectToUrl)(obj);
            const decoded = (0, query_params_1.decodeUrlToObject)(encoded);
            (0, vitest_1.expect)(decoded).toEqual(obj);
        });
        (0, vitest_1.it)('should handle complex nested objects', () => {
            const obj = {
                user: {
                    name: 'John',
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                    },
                },
            };
            const encoded = (0, query_params_1.encodeObjectToUrl)(obj);
            const decoded = (0, query_params_1.decodeUrlToObject)(encoded);
            (0, vitest_1.expect)(decoded).toEqual(obj);
        });
        (0, vitest_1.it)('should return null for invalid encoded string', () => {
            const decoded = (0, query_params_1.decodeUrlToObject)('invalid-base64!!!');
            (0, vitest_1.expect)(decoded).toBeNull();
        });
        (0, vitest_1.it)('should produce URL-safe strings', () => {
            const obj = { data: 'test' };
            const encoded = (0, query_params_1.encodeObjectToUrl)(obj);
            // Should not contain +, /, or =
            (0, vitest_1.expect)(encoded).not.toContain('+');
            (0, vitest_1.expect)(encoded).not.toContain('/');
            (0, vitest_1.expect)(encoded).not.toContain('=');
        });
    });
    (0, vitest_1.describe)('buildPaginatedUrl', () => {
        (0, vitest_1.it)('should build paginated URL', () => {
            const result = (0, query_params_1.buildPaginatedUrl)('/garage-sales', 2, 20);
            (0, vitest_1.expect)(result).toBe('/garage-sales?page=2&limit=20');
        });
        (0, vitest_1.it)('should include additional parameters', () => {
            const result = (0, query_params_1.buildPaginatedUrl)('/garage-sales', 1, 10, {
                search: 'furniture',
                tags: ['tools'],
            });
            (0, vitest_1.expect)(result).toContain('page=1');
            (0, vitest_1.expect)(result).toContain('limit=10');
            (0, vitest_1.expect)(result).toContain('search=furniture');
        });
    });
    (0, vitest_1.describe)('getPaginationFromQuery', () => {
        (0, vitest_1.it)('should extract pagination info', () => {
            const result = (0, query_params_1.getPaginationFromQuery)('?page=3&limit=25');
            (0, vitest_1.expect)(result).toEqual({
                page: 3,
                limit: 25,
                offset: 50, // (3 - 1) * 25
            });
        });
        (0, vitest_1.it)('should use default page size', () => {
            const result = (0, query_params_1.getPaginationFromQuery)('?page=2', 20);
            (0, vitest_1.expect)(result).toEqual({
                page: 2,
                limit: 20,
                offset: 20, // (2 - 1) * 20
            });
        });
        (0, vitest_1.it)('should handle missing parameters', () => {
            const result = (0, query_params_1.getPaginationFromQuery)('', 10);
            (0, vitest_1.expect)(result).toEqual({
                page: 1,
                limit: 10,
                offset: 0,
            });
        });
        (0, vitest_1.it)('should enforce minimum page of 1', () => {
            const result = (0, query_params_1.getPaginationFromQuery)('?page=-5&limit=10');
            (0, vitest_1.expect)(result.page).toBe(1);
            (0, vitest_1.expect)(result.offset).toBe(0);
        });
        (0, vitest_1.it)('should enforce minimum limit of 1', () => {
            const result = (0, query_params_1.getPaginationFromQuery)('?page=1&limit=0');
            (0, vitest_1.expect)(result.limit).toBe(1);
        });
        (0, vitest_1.it)('should calculate correct offsets', () => {
            (0, vitest_1.expect)((0, query_params_1.getPaginationFromQuery)('?page=1&limit=10').offset).toBe(0);
            (0, vitest_1.expect)((0, query_params_1.getPaginationFromQuery)('?page=2&limit=10').offset).toBe(10);
            (0, vitest_1.expect)((0, query_params_1.getPaginationFromQuery)('?page=5&limit=20').offset).toBe(80);
        });
    });
});
//# sourceMappingURL=query-params.test.js.map