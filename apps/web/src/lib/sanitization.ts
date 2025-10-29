/**
 * Input Sanitization Utilities
 * 
 * Provides functions to sanitize user input and prevent XSS/injection attacks.
 * Use these in combination with Zod validation for comprehensive protection.
 * 
 * @module sanitization
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 * 
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 * 
 * @example
 * ```ts
 * const safe = sanitizeHtml('<script>alert("xss")</script>Hello');
 * // Returns: 'Hello'
 * ```
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitize string for safe database storage
 * Trims whitespace and removes null bytes
 * 
 * @param {string} input - Raw string input
 * @returns {string} Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/\0/g, '') // Remove null bytes
    .trim();
}

/**
 * Sanitize email address
 * Ensures email is lowercase and trimmed
 * 
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/\s/g, ''); // Remove any whitespace
}

/**
 * Sanitize URL to prevent javascript: and data: schemes
 * 
 * @param {string} url - URL input
 * @returns {string | null} Sanitized URL or null if invalid
 * 
 * @example
 * ```ts
 * sanitizeUrl('javascript:alert(1)'); // Returns null
 * sanitizeUrl('https://example.com'); // Returns 'https://example.com'
 * ```
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  if (
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:') ||
    trimmed.toLowerCase().startsWith('vbscript:')
  ) {
    return null;
  }
  
  // Only allow http, https, and mailto
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('mailto:') &&
    !trimmed.startsWith('/')
  ) {
    return null;
  }
  
  return trimmed;
}

/**
 * Sanitize phone number to remove non-numeric characters
 * 
 * @param {string} phone - Phone number input
 * @returns {string} Sanitized phone with only digits and +
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  return phone.replace(/[^\d+()-\s]/g, '').trim();
}

/**
 * Sanitize array of strings
 * 
 * @param {string[]} arr - Array of strings
 * @param {number} maxLength - Maximum string length
 * @param {number} maxItems - Maximum array length
 * @returns {string[]} Sanitized array
 */
export function sanitizeStringArray(
  arr: string[],
  maxLength: number = 100,
  maxItems: number = 50
): string[] {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .slice(0, maxItems)
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0 && item.length <= maxLength);
}

/**
 * Sanitize search query
 * Removes special characters that could cause issues
 * 
 * @param {string} query - Search query
 * @returns {string} Sanitized query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  return query
    .replace(/[<>'"]/g, '') // Remove potentially dangerous chars
    .replace(/\\/g, '') // Remove backslashes
    .trim()
    .slice(0, 200); // Limit length
}

/**
 * Validate and sanitize JSON input
 * Prevents JSON injection attacks
 * 
 * @param {any} input - Input to validate
 * @param {number} maxDepth - Maximum nesting depth
 * @returns {{ valid: boolean, data: any | null }}
 */
export function sanitizeJson(input: any, maxDepth: number = 10): {
  valid: boolean;
  data: any | null;
} {
  try {
    // Check depth to prevent billion laughs attack
    const checkDepth = (obj: any, depth: number = 0): boolean => {
      if (depth > maxDepth) return false;
      
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (!checkDepth(obj[key], depth + 1)) {
            return false;
          }
        }
      }
      
      return true;
    };
    
    if (!checkDepth(input)) {
      return { valid: false, data: null };
    }
    
    return { valid: true, data: input };
  } catch {
    return { valid: false, data: null };
  }
}

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s()-]{7,20}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9\s-_]+$/,
  numeric: /^\d+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}$/,
  postalCode: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, // Canadian postal code
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
};

/**
 * Sanitize filename for safe storage
 * 
 * @param {string} filename - Original filename
 * @returns {string} Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'file';
  
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^[._]+/, '') // Remove leading dots/underscores
    .slice(0, 255); // Limit length
}

/**
 * Escape special characters for SQL LIKE queries
 * Prevents SQL injection in LIKE clauses
 * 
 * @param {string} input - Search input
 * @returns {string} Escaped string
 */
export function escapeLikeQuery(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

