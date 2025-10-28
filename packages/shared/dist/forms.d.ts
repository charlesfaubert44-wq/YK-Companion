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
export declare function validateField<T = any>(value: T, config: FieldConfig<T>, fieldName: string): string | null;
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
export declare function validateForm<T extends Record<string, any>>(formData: T, schema: {
    [K in keyof T]?: FieldConfig<T[K]>;
}): ValidationResult;
/**
 * Get error message for a specific field from validation result
 * @param errors - Array of field errors
 * @param fieldName - Field name to get error for
 * @returns Error message or null
 * @example
 * const emailError = getFieldError(validationResult.errors, 'email');
 * if (emailError) <span className="error">{emailError}</span>
 */
export declare function getFieldError(errors: FieldError[], fieldName: string): string | null;
/**
 * Check if a specific field has an error
 * @param errors - Array of field errors
 * @param fieldName - Field name to check
 * @returns True if field has error
 * @example
 * <input className={hasFieldError(errors, 'email') ? 'invalid' : ''} />
 */
export declare function hasFieldError(errors: FieldError[], fieldName: string): boolean;
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
export declare function getFormChanges<T extends Record<string, any>>(original: T, updated: T): Partial<T>;
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
export declare function toFormData(data: Record<string, any>, options?: {
    arrayFormat?: 'brackets' | 'indices' | 'repeat';
    includeNull?: boolean;
}): FormData;
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
export declare function sanitizeFormData<T extends Record<string, any>>(data: T, fields?: (keyof T)[]): T;
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
export declare function getDefaultFormValues<T extends Record<string, any>>(schema: {
    [K in keyof T]?: FieldConfig<T[K]> & {
        defaultValue?: T[K];
    };
}): Partial<T>;
/**
 * Reset form to initial values
 * @param initialValues - Initial form values
 * @returns Reset form values
 * @example
 * const [form, setForm] = useState(initialValues);
 * // On reset:
 * setForm(resetForm(initialValues));
 */
export declare function resetForm<T extends Record<string, any>>(initialValues: T): T;
/**
 * Common validation patterns for form fields
 */
export declare const ValidationPatterns: {
    readonly email: RegExp;
    readonly phone: RegExp;
    readonly postalCode: RegExp;
    readonly url: RegExp;
    readonly alphanumeric: RegExp;
    readonly alphanumericWithSpaces: RegExp;
    readonly onlyLetters: RegExp;
    readonly onlyNumbers: RegExp;
    readonly noSpecialChars: RegExp;
    readonly strongPassword: RegExp;
};
/**
 * Pre-built field validators for common use cases
 */
export declare const FieldValidators: {
    /**
     * Email validator
     */
    readonly email: (label?: string) => FieldConfig<string>;
    /**
     * Phone number validator
     */
    readonly phone: (label?: string, required?: boolean) => FieldConfig<string>;
    /**
     * Canadian postal code validator
     */
    readonly postalCode: (label?: string) => FieldConfig<string>;
    /**
     * URL validator
     */
    readonly url: (label?: string, required?: boolean) => FieldConfig<string>;
    /**
     * Required text field validator
     */
    readonly requiredText: (label: string, minLength?: number, maxLength?: number) => FieldConfig<string>;
    /**
     * Number range validator
     */
    readonly numberRange: (label: string, min?: number, max?: number, required?: boolean) => FieldConfig<number>;
    /**
     * Date validator (must be in future)
     */
    readonly futureDate: (label?: string) => FieldConfig<string>;
    /**
     * Password validator (strong password requirements)
     */
    readonly password: (label?: string) => FieldConfig<string>;
    /**
     * Confirm password validator
     */
    readonly confirmPassword: (passwordValue: string, label?: string) => FieldConfig<string>;
};
//# sourceMappingURL=forms.d.ts.map