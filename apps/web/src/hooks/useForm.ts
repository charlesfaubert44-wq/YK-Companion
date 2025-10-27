/**
 * useForm hook for YK Buddy
 * Comprehensive form state management with validation
 */

'use client';

import { useState, useCallback, FormEvent } from 'react';
import type { FieldConfig, ValidationResult } from '@yk-trip-planner/shared';
import { validateForm, getFieldError as getError } from '@yk-trip-planner/shared';

/**
 * Form hook configuration
 */
export interface UseFormConfig<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: { [K in keyof T]?: FieldConfig<T[K]> };
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Comprehensive form management hook with validation
 * @param config - Form configuration
 * @returns Form state and handlers
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   validationSchema: {
 *     email: { required: true, pattern: /email-regex/ },
 *     password: { required: true, minLength: 8 }
 *   },
 *   onSubmit: async (values) => {
 *     await login(values);
 *   }
 * });
 *
 * <form onSubmit={form.handleSubmit}>
 *   <input {...form.getFieldProps('email')} />
 *   {form.getFieldError('email') && <span>{form.getFieldError('email')}</span>}
 * </form>
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate the entire form
   */
  const validate = useCallback(
    (valuesToValidate: T = values): ValidationResult => {
      const result = validateForm(valuesToValidate, validationSchema);
      setErrors(result);
      return result;
    },
    [values, validationSchema]
  );

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const newValue = event.target.type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : event.target.value;

      setValues((prev) => ({ ...prev, [field]: newValue as T[keyof T] }));

      if (validateOnChange) {
        const newValues = { ...values, [field]: newValue };
        validate(newValues as T);
      }
    },
    [values, validateOnChange, validate]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (validateOnBlur) {
        validate();
      }
    },
    [validateOnBlur, validate]
  );

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({
      isValid: false,
      errors: [...prev.errors.filter((e) => e.field !== field), { field: String(field), message }],
    }));
  }, []);

  /**
   * Get field error message (only if touched)
   */
  const getFieldError = useCallback(
    (field: keyof T): string | null => {
      if (!touched[field]) return null;
      return getError(errors.errors, String(field));
    },
    [errors, touched]
  );

  /**
   * Get field props for easy binding
   */
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      name: String(field),
      value: values[field] as string,
      onChange: handleChange(field),
      onBlur: handleBlur(field),
    }),
    [values, handleChange, handleBlur]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const validationResult = validate();

      if (!validationResult.isValid) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({ isValid: true, errors: [] });
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Check if field has been touched
   */
  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return !!touched[field];
  }, [touched]);

  /**
   * Check if form is valid
   */
  const isValid = errors.isValid;

  /**
   * Check if form has been modified
   */
  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors: errors.errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    getFieldError,
    getFieldProps,
    validate,
    reset,
    isFieldTouched,
    isDirty,
  };
}
