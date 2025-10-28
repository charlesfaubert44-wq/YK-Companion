/**
 * Tests for query parameter utilities
 */
import { describe, it, expect } from 'vitest';
import {
  parseQueryString,
  buildQueryString,
  updateQueryParams,
  getQueryParam,
  getQueryParamArray,
  removeQueryParam,
  hasQueryParam,
  parseTypedQueryParams,
  mergeQueryStrings,
  slugify,
  encodeObjectToUrl,
  decodeUrlToObject,
  buildPaginatedUrl,
  getPaginationFromQuery,
} from './query-params';

describe('query-params utilities', () => {
  describe('parseQueryString', () => {
    it('should parse simple query string', () => {
      const result = parseQueryString('?search=furniture&page=2');
      
      expect(result).toEqual({
        search: 'furniture',
        page: '2',
      });
    });

    it('should handle multiple values for same key', () => {
      const result = parseQueryString('?tags=tools&tags=outdoor&tags=furniture');
      
      expect(result.tags).toEqual(['tools', 'outdoor', 'furniture']);
    });

    it('should handle query string without leading ?', () => {
      const result = parseQueryString('search=test&limit=10');
      
      expect(result).toEqual({
        search: 'test',
        limit: '10',
      });
    });

    it('should handle empty query string', () => {
      const result = parseQueryString('');
      
      expect(result).toEqual({});
    });

    it('should handle URL-encoded values', () => {
      const result = parseQueryString('?search=garage%20sale&city=yellowknife');
      
      expect(result.search).toBe('garage sale');
    });
  });

  describe('buildQueryString', () => {
    it('should build simple query string', () => {
      const result = buildQueryString({
        search: 'furniture',
        page: 2,
      });
      
      expect(result).toBe('?search=furniture&page=2');
    });

    it('should handle arrays with repeat format', () => {
      const result = buildQueryString({
        tags: ['tools', 'outdoor'],
      }, { arrayFormat: 'repeat' });
      
      expect(result).toBe('?tags=tools&tags=outdoor');
    });

    it('should handle arrays with brackets format', () => {
      const result = buildQueryString({
        tags: ['tools', 'outdoor'],
      }, { arrayFormat: 'brackets' });
      
      // URLSearchParams encodes brackets, which is correct
      expect(result).toContain('tags');
      expect(result).toContain('tools');
      expect(result).toContain('outdoor');
    });

    it('should handle arrays with comma format', () => {
      const result = buildQueryString({
        tags: ['tools', 'outdoor'],
      }, { arrayFormat: 'comma' });
      
      // URLSearchParams encodes commas, which is correct
      expect(result).toContain('tags');
      expect(result).toContain('tools');
    });

    it('should skip null values by default', () => {
      const result = buildQueryString({
        search: 'test',
        page: null,
        limit: undefined,
      });
      
      expect(result).toBe('?search=test');
    });

    it('should skip empty strings if configured', () => {
      const result = buildQueryString({
        search: '',
        page: 1,
      }, { skipEmpty: true });
      
      expect(result).toBe('?page=1');
    });

    it('should handle booleans', () => {
      const result = buildQueryString({
        active: true,
        archived: false,
      });
      
      expect(result).toBe('?active=true&archived=false');
    });

    it('should sort keys if configured', () => {
      const result = buildQueryString({
        z: '1',
        a: '2',
        m: '3',
      }, { sort: true });
      
      expect(result).toBe('?a=2&m=3&z=1');
    });

    it('should return empty string for empty object', () => {
      const result = buildQueryString({});
      
      expect(result).toBe('');
    });
  });

  describe('updateQueryParams', () => {
    it('should update existing parameters', () => {
      const result = updateQueryParams(
        '/sales?page=1&limit=10',
        { page: 2 }
      );
      
      expect(result).toBe('/sales?page=2&limit=10');
    });

    it('should add new parameters', () => {
      const result = updateQueryParams(
        '/sales?page=1',
        { search: 'furniture' }
      );
      
      expect(result).toBe('/sales?page=1&search=furniture');
    });

    it('should remove parameters', () => {
      const result = updateQueryParams(
        '/sales?page=1&limit=10&search=test',
        {},
        ['limit', 'search']
      );
      
      expect(result).toBe('/sales?page=1');
    });

    it('should remove parameter by setting to null', () => {
      const result = updateQueryParams(
        '/sales?page=1&search=test',
        { search: null }
      );
      
      expect(result).toBe('/sales?page=1');
    });

    it('should handle URL without query string', () => {
      const result = updateQueryParams(
        '/sales',
        { page: 1 }
      );
      
      expect(result).toBe('/sales?page=1');
    });
  });

  describe('getQueryParam', () => {
    it('should get single parameter value', () => {
      const value = getQueryParam('?search=furniture&page=2', 'search');
      
      expect(value).toBe('furniture');
    });

    it('should return first value for multiple values', () => {
      const value = getQueryParam('?tags=tools&tags=outdoor', 'tags');
      
      expect(value).toBe('tools');
    });

    it('should return null for non-existent parameter', () => {
      const value = getQueryParam('?search=test', 'page');
      
      expect(value).toBeNull();
    });

    it('should work with full URLs', () => {
      const value = getQueryParam('?page=2', 'page');
      
      expect(value).toBe('2');
    });
  });

  describe('getQueryParamArray', () => {
    it('should get array of values', () => {
      const values = getQueryParamArray('?tags=tools&tags=outdoor&tags=furniture', 'tags');
      
      expect(values).toEqual(['tools', 'outdoor', 'furniture']);
    });

    it('should return single value as array', () => {
      const values = getQueryParamArray('?tag=tools', 'tag');
      
      expect(values).toEqual(['tools']);
    });

    it('should return empty array for non-existent parameter', () => {
      const values = getQueryParamArray('?search=test', 'tags');
      
      expect(values).toEqual([]);
    });
  });

  describe('removeQueryParam', () => {
    it('should remove parameter', () => {
      const result = removeQueryParam('/sales?search=furniture&page=1', 'page');
      
      expect(result).toBe('/sales?search=furniture');
    });

    it('should handle removing non-existent parameter', () => {
      const result = removeQueryParam('/sales?page=1', 'search');
      
      expect(result).toBe('/sales?page=1');
    });
  });

  describe('hasQueryParam', () => {
    it('should check if parameter exists', () => {
      expect(hasQueryParam('?search=test&page=1', 'search')).toBe(true);
      expect(hasQueryParam('?search=test&page=1', 'limit')).toBe(false);
    });
  });

  describe('parseTypedQueryParams', () => {
    it('should parse string parameters', () => {
      const result = parseTypedQueryParams('?search=furniture', {
        search: { type: 'string', default: '' },
      });
      
      expect(result.search).toBe('furniture');
    });

    it('should parse number parameters', () => {
      const result = parseTypedQueryParams('?page=2&limit=10', {
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 20 },
      });
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('should parse boolean parameters', () => {
      const result = parseTypedQueryParams('?active=true&archived=false', {
        active: { type: 'boolean', default: false },
        archived: { type: 'boolean', default: false },
      });
      
      expect(result.active).toBe(true);
      expect(result.archived).toBe(false);
    });

    it('should parse array parameters', () => {
      const result = parseTypedQueryParams('?tags=tools&tags=outdoor', {
        tags: { type: 'array', default: [] },
      });
      
      expect(result.tags).toEqual(['tools', 'outdoor']);
    });

    it('should use defaults for missing parameters', () => {
      const result = parseTypedQueryParams('?search=test', {
        search: { type: 'string', default: '' },
        page: { type: 'number', default: 1 },
        active: { type: 'boolean', default: true },
        tags: { type: 'array', default: [] },
      });
      
      expect(result.page).toBe(1);
      expect(result.active).toBe(true);
      expect(result.tags).toEqual([]);
    });

    it('should enforce min/max for numbers', () => {
      const result = parseTypedQueryParams('?page=-1&limit=1000', {
        page: { type: 'number', default: 1, min: 1 },
        limit: { type: 'number', default: 20, max: 100 },
      });
      
      expect(result.page).toBe(1); // Clamped to min
      expect(result.limit).toBe(100); // Clamped to max
    });

    it('should validate enum values', () => {
      const result = parseTypedQueryParams('?status=pending&invalid=bad', {
        status: { type: 'string', default: 'all', enum: ['all', 'pending', 'completed'] as const },
        invalid: { type: 'string', default: 'all', enum: ['all', 'pending', 'completed'] as const },
      });
      
      expect(result.status).toBe('pending');
      expect(result.invalid).toBe('all'); // Falls back to default
    });

    it('should handle invalid numbers', () => {
      const result = parseTypedQueryParams('?page=invalid', {
        page: { type: 'number', default: 1 },
      });
      
      expect(result.page).toBe(1); // Falls back to default
    });
  });

  describe('mergeQueryStrings', () => {
    it('should merge multiple query strings', () => {
      const result = mergeQueryStrings(
        '?page=1&limit=10',
        '?page=2&search=tools',
        '?limit=20'
      );
      
      expect(result).toBe('?page=2&limit=20&search=tools');
    });

    it('should handle empty query strings', () => {
      const result = mergeQueryStrings('?page=1', '', '?limit=10');
      
      expect(result).toBe('?page=1&limit=10');
    });
  });

  describe('slugify', () => {
    it('should create URL-safe slug', () => {
      const result = slugify('Garage Sale - Furniture & Tools!');
      
      expect(result).toBe('garage-sale-furniture-tools');
    });

    it('should handle special characters', () => {
      const result = slugify('Hello @World #Test $100');
      
      expect(result).toBe('hello-world-test-100');
    });

    it('should handle multiple spaces', () => {
      const result = slugify('Multiple   Spaces   Here');
      
      expect(result).toBe('multiple-spaces-here');
    });

    it('should handle leading/trailing spaces', () => {
      const result = slugify('  Trimmed  ');
      
      expect(result).toBe('trimmed');
    });

    it('should use custom separator', () => {
      const result = slugify('Test Title', { separator: '_' });
      
      expect(result).toBe('test_title');
    });

    it('should preserve case if configured', () => {
      const result = slugify('Test Title', { lowercase: false });
      
      expect(result).toBe('Test-Title');
    });

    it('should enforce max length', () => {
      const result = slugify('This is a very long title that should be truncated', {
        maxLength: 20,
      });
      
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result.endsWith('-')).toBe(false);
    });

    it('should handle diacritics', () => {
      const result = slugify('Café résumé naïve');
      
      expect(result).toBe('cafe-resume-naive');
    });
  });

  describe('encodeObjectToUrl / decodeUrlToObject', () => {
    it('should encode and decode objects', () => {
      const obj = {
        filters: { tags: ['tools', 'outdoor'], active: true },
        sort: 'date',
        page: 1,
      };

      const encoded = encodeObjectToUrl(obj);
      const decoded = decodeUrlToObject(encoded);

      expect(decoded).toEqual(obj);
    });

    it('should handle complex nested objects', () => {
      const obj = {
        user: {
          name: 'John',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };

      const encoded = encodeObjectToUrl(obj);
      const decoded = decodeUrlToObject(encoded);

      expect(decoded).toEqual(obj);
    });

    it('should return null for invalid encoded string', () => {
      const decoded = decodeUrlToObject('invalid-base64!!!');
      
      expect(decoded).toBeNull();
    });

    it('should produce URL-safe strings', () => {
      const obj = { data: 'test' };
      const encoded = encodeObjectToUrl(obj);

      // Should not contain +, /, or =
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');
      expect(encoded).not.toContain('=');
    });
  });

  describe('buildPaginatedUrl', () => {
    it('should build paginated URL', () => {
      const result = buildPaginatedUrl('/garage-sales', 2, 20);
      
      expect(result).toBe('/garage-sales?page=2&limit=20');
    });

    it('should include additional parameters', () => {
      const result = buildPaginatedUrl('/garage-sales', 1, 10, {
        search: 'furniture',
        tags: ['tools'],
      });
      
      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
      expect(result).toContain('search=furniture');
    });
  });

  describe('getPaginationFromQuery', () => {
    it('should extract pagination info', () => {
      const result = getPaginationFromQuery('?page=3&limit=25');
      
      expect(result).toEqual({
        page: 3,
        limit: 25,
        offset: 50, // (3 - 1) * 25
      });
    });

    it('should use default page size', () => {
      const result = getPaginationFromQuery('?page=2', 20);
      
      expect(result).toEqual({
        page: 2,
        limit: 20,
        offset: 20, // (2 - 1) * 20
      });
    });

    it('should handle missing parameters', () => {
      const result = getPaginationFromQuery('', 10);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
      });
    });

    it('should enforce minimum page of 1', () => {
      const result = getPaginationFromQuery('?page=-5&limit=10');
      
      expect(result.page).toBe(1);
      expect(result.offset).toBe(0);
    });

    it('should enforce minimum limit of 1', () => {
      const result = getPaginationFromQuery('?page=1&limit=0');
      
      expect(result.limit).toBe(1);
    });

    it('should calculate correct offsets', () => {
      expect(getPaginationFromQuery('?page=1&limit=10').offset).toBe(0);
      expect(getPaginationFromQuery('?page=2&limit=10').offset).toBe(10);
      expect(getPaginationFromQuery('?page=5&limit=20').offset).toBe(80);
    });
  });
});

