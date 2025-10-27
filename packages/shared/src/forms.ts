/**
 * Form utilities for YK Companion
 * Provides reusable form validation, state management, and helper functions
 */

/**
 * Form field error type
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

/**
 * Form field configuration for validation
 */
export interface FieldConfig<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  label?: string;
}

/**
 * Validate a single form field
 * @param value - Field value
 * @param config - Validation configuration
 * @param fieldName - Field name for error messages
 * @returns Error message or null if valid
 * @example
 * const error = validateField(email, {
 *   required: true,
 *   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
 *   label: 'Email'
 * }, 'email');
 */
export function validateField<T = any>(
  value: T,
  config: FieldConfig<T>,
  fieldName: string
): string | null {
  const { required, minLength, maxLength, min, max, pattern, custom, label } = config;
  const displayName = label || fieldName;

  // Required check
  if (required) {
    if (value === null || value === undefined || value === '') {
      return `${displayName} is required`;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return `${displayName} is required`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${displayName} must have at least one item`;
    }
  }

  // Skip other validations if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // String length validations
  if (typeof value === 'string') {
    if (minLength !== undefined && value.length < minLength) {
      return `${displayName} must be at least ${minLength} characters`;
    }
    if (maxLength !== undefined && value.length > maxLength) {
      return `${displayName} must be no more than ${maxLength} characters`;
    }
  }

  // Number range validations
  if (typeof value === 'number') {
    if (min !== undefined && value < min) {
      return `${displayName} must be at least ${min}`;
    }
    if (max !== undefined && value > max) {
      return `${displayName} must be no more than ${max}`;
    }
  }

  // Pattern validation (for strings)
  if (pattern && typeof value === 'string') {
    if (!pattern.test(value)) {
      return `${displayName} format is invalid`;
    }
  }

  // Custom validation
  if (custom) {
    const customError = custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
}

/**
 * Validate an entire form object
 * @param formData - Form data object
 * @param schema - Validation schema
 * @returns ValidationResult with errors
 * @example
 * const result = validateForm(formData, {
 *   email: { required: true, pattern: /email-regex/ },
 *   age: { required: true, min: 18, max: 120 }
 * });
 * if (!result.isValid) {
 *   result.errors.forEach(err => console.error(err.message));
 * }
 */
export function validateForm<T extends Record<string, any>>(
  formData: T,
  schema: { [K in keyof T]?: FieldConfig<T[K]> }
): ValidationResult {
  const errors: FieldError[] = [];

  for (const fieldName in schema) {
    const config = schema[fieldName];
    const value = formData[fieldName];

    if (config) {
      const error = validateField(value, config, fieldName);
      if (error) {
        errors.push({ field: fieldName, message: error });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get error message for a specific field from validation result
 * @param errors - Array of field errors
 * @param fieldName - Field name to get error for
 * @returns Error message or null
 * @example
 * const emailError = getFieldError(validationResult.errors, 'email');
 * if (emailError) <span className="error">{emailError}</span>
 */
export function getFieldError(errors: FieldError[], fieldName: string): string | null {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
}

/**
 * Check if a specific field has an error
 * @param errors - Array of field errors
 * @param fieldName - Field name to check
 * @returns True if field has error
 * @example
 * <input className={hasFieldError(errors, 'email') ? 'invalid' : ''} />
 */
export function hasFieldError(errors: FieldError[], fieldName: string): boolean {
  return errors.some((e) => e.field === fieldName);
}

/**
 * Extract changed fields between two form objects
 * Useful for partial updates
 * @param original - Original form data
 * @param updated - Updated form data
 * @returns Object with only changed fields
 * @example
 * const changes = getFormChanges(originalProfile, updatedProfile);
 * // Only send changed fields to API
 * await updateProfile(userId, changes);
 */
export function getFormChanges<T extends Record<string, any>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (original[key] !== updated[key]) {
      changes[key] = updated[key];
    }
  }

  return changes;
}

/**
 * Convert form data to FormData object for multipart uploads
 * @param data - Form data object
 * @param options - Conversion options
 * @returns FormData object
 * @example
 * const formData = toFormData({
 *   title: 'Garage Sale',
 *   photos: [file1, file2],
 *   tags: ['furniture', 'tools']
 * });
 * await fetch('/api/upload', { method: 'POST', body: formData });
 */
export function toFormData(
  data: Record<string, any>,
  options: {
    arrayFormat?: 'brackets' | 'indices' | 'repeat';
    includeNull?: boolean;
  } = {}
): FormData {
  const { arrayFormat = 'repeat', includeNull = false } = options;
  const formData = new FormData();

  for (const key in data) {
    const value = data[key];

    // Skip null/undefined unless includeNull is true
    if ((value === null || value === undefined) && !includeNull) {
      continue;
    }

    // Handle File objects
    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          const fieldName =
            arrayFormat === 'brackets'
              ? `${key}[]`
              : arrayFormat === 'indices'
              ? `${key}[${index}]`
              : key;
          formData.append(fieldName, String(item));
        }
      });
      continue;
    }

    // Handle objects (convert to JSON string)
    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    // Handle primitive values
    formData.append(key, String(value));
  }

  return formData;
}

/**
 * Sanitize form input by trimming whitespace and removing extra spaces
 * @param data - Form data object
 * @param fields - Optional array of fields to sanitize (defaults to all string fields)
 * @returns Sanitized form data
 * @example
 * const clean = sanitizeFormData({
 *   title: '  Garage Sale  ',
 *   description: 'Multiple   spaces',
 *   price: 100
 * });
 * // { title: 'Garage Sale', description: 'Multiple spaces', price: 100 }
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  fields?: (keyof T)[]
): T {
  const sanitized = { ...data };

  const fieldsToSanitize = fields || (Object.keys(data) as (keyof T)[]);

  fieldsToSanitize.forEach((field) => {
    const value = sanitized[field];
    if (typeof value === 'string') {
      // Trim and replace multiple spaces with single space
      sanitized[field] = value.trim().replace(/\s+/g, ' ') as T[typeof field];
    }
  });

  return sanitized;
}

/**
 * Create default values for a form from a schema
 * @param schema - Form schema with field configurations
 * @returns Object with default values
 * @example
 * const defaultValues = getDefaultFormValues({
 *   title: { required: true },
 *   status: { required: true },
 *   tags: { required: false }
 * });
 * // { title: '', status: '', tags: '' }
 */
export function getDefaultFormValues<T extends Record<string, any>>(
  schema: { [K in keyof T]?: FieldConfig<T[K]> & { defaultValue?: T[K] } }
): Partial<T> {
  const defaults: Partial<T> = {};

  for (const key in schema) {
    const config = schema[key];
    if (config?.defaultValue !== undefined) {
      defaults[key] = config.defaultValue;
    } else {
      // Provide sensible defaults based on config
      defaults[key] = '' as T[typeof key];
    }
  }

  return defaults;
}

/**
 * Reset form to initial values
 * @param initialValues - Initial form values
 * @returns Reset form values
 * @example
 * const [form, setForm] = useState(initialValues);
 * // On reset:
 * setForm(resetForm(initialValues));
 */
export function resetForm<T extends Record<string, any>>(initialValues: T): T {
  return { ...initialValues };
}

/**
 * Common validation patterns for form fields
 */
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
  postalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  onlyLetters: /^[a-zA-Z]+$/,
  onlyNumbers: /^\d+$/,
  noSpecialChars: /^[a-zA-Z0-9\s-_]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

/**
 * Pre-built field validators for common use cases
 */
export const FieldValidators = {
  /**
   * Email validator
   */
  email: (label: string = 'Email'): FieldConfig<string> => ({
    required: true,
    pattern: ValidationPatterns.email,
    label,
  }),

  /**
   * Phone number validator
   */
  phone: (label: string = 'Phone', required: boolean = true): FieldConfig<string> => ({
    required,
    pattern: ValidationPatterns.phone,
    label,
  }),

  /**
   * Canadian postal code validator
   */
  postalCode: (label: string = 'Postal Code'): FieldConfig<string> => ({
    required: true,
    pattern: ValidationPatterns.postalCode,
    label,
  }),

  /**
   * URL validator
   */
  url: (label: string = 'URL', required: boolean = false): FieldConfig<string> => ({
    required,
    pattern: ValidationPatterns.url,
    label,
  }),

  /**
   * Required text field validator
   */
  requiredText: (
    label: string,
    minLength?: number,
    maxLength?: number
  ): FieldConfig<string> => ({
    required: true,
    minLength,
    maxLength,
    label,
  }),

  /**
   * Number range validator
   */
  numberRange: (
    label: string,
    min?: number,
    max?: number,
    required: boolean = true
  ): FieldConfig<number> => ({
    required,
    min,
    max,
    label,
  }),

  /**
   * Date validator (must be in future)
   */
  futureDate: (label: string = 'Date'): FieldConfig<string> => ({
    required: true,
    label,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today ? `${label} must be in the future` : null;
    },
  }),

  /**
   * Password validator (strong password requirements)
   */
  password: (label: string = 'Password'): FieldConfig<string> => ({
    required: true,
    minLength: 8,
    pattern: ValidationPatterns.strongPassword,
    label,
    custom: (value: string) => {
      if (!/[A-Z]/.test(value)) return `${label} must contain an uppercase letter`;
      if (!/[a-z]/.test(value)) return `${label} must contain a lowercase letter`;
      if (!/\d/.test(value)) return `${label} must contain a number`;
      if (!/[@$!%*?&]/.test(value)) return `${label} must contain a special character`;
      return null;
    },
  }),

  /**
   * Confirm password validator
   */
  confirmPassword: (passwordValue: string, label: string = 'Confirm Password'): FieldConfig<string> => ({
    required: true,
    label,
    custom: (value: string) => {
      return value !== passwordValue ? 'Passwords do not match' : null;
    },
  }),
} as const;
