/**
 * Tests for form utilities
 */
import { describe, it, expect } from 'vitest';
import {
  validateField,
  validateForm,
  getFieldError,
  hasFieldError,
  getFormChanges,
  toFormData,
  sanitizeFormData,
  getDefaultFormValues,
  resetForm,
  ValidationPatterns,
  FieldValidators,
} from './forms';

describe('form utilities', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const error = validateField('', { required: true, label: 'Email' }, 'email');
      expect(error).toBe('Email is required');

      const valid = validateField('test@example.com', { required: true }, 'email');
      expect(valid).toBeNull();
    });

    it('should validate min and max length', () => {
      const tooShort = validateField('ab', { minLength: 3, label: 'Name' }, 'name');
      expect(tooShort).toBe('Name must be at least 3 characters');

      const tooLong = validateField('abcdefghij', { maxLength: 5, label: 'Code' }, 'code');
      expect(tooLong).toBe('Code must be no more than 5 characters');

      const valid = validateField('abc', { minLength: 2, maxLength: 5 }, 'name');
      expect(valid).toBeNull();
    });

    it('should validate number ranges', () => {
      const tooLow = validateField(5, { min: 10, label: 'Age' }, 'age');
      expect(tooLow).toBe('Age must be at least 10');

      const tooHigh = validateField(150, { max: 120, label: 'Age' }, 'age');
      expect(tooHigh).toBe('Age must be no more than 120');

      const valid = validateField(25, { min: 18, max: 120 }, 'age');
      expect(valid).toBeNull();
    });

    it('should validate patterns', () => {
      const invalid = validateField('not-an-email', {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        label: 'Email',
      }, 'email');
      expect(invalid).toBe('Email format is invalid');

      const valid = validateField('test@example.com', {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      }, 'email');
      expect(valid).toBeNull();
    });

    it('should validate with custom function', () => {
      const error = validateField('test', {
        custom: (value: string) => value === 'forbidden' ? 'This value is forbidden' : null,
      }, 'field');
      expect(error).toBeNull();

      const invalid = validateField('forbidden', {
        custom: (value: string) => value === 'forbidden' ? 'This value is forbidden' : null,
      }, 'field');
      expect(invalid).toBe('This value is forbidden');
    });

    it('should skip validations for empty optional fields', () => {
      const result = validateField('', {
        required: false,
        minLength: 5,
      }, 'optional');
      expect(result).toBeNull();
    });

    it('should validate empty arrays as required', () => {
      const error = validateField([], { required: true, label: 'Tags' }, 'tags');
      expect(error).toBe('Tags must have at least one item');
    });

    it('should trim whitespace for required validation', () => {
      const error = validateField('   ', { required: true, label: 'Name' }, 'name');
      expect(error).toBe('Name is required');
    });
  });

  describe('validateForm', () => {
    it('should validate entire form object', () => {
      const formData = {
        email: 'invalid-email',
        age: 15,
        name: '',
      };

      const result = validateForm(formData, {
        email: { required: true, pattern: ValidationPatterns.email, label: 'Email' },
        age: { required: true, min: 18, label: 'Age' },
        name: { required: true, label: 'Name' },
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });

    it('should return valid for correct data', () => {
      const formData = {
        email: 'test@example.com',
        age: 25,
        name: 'John Doe',
      };

      const result = validateForm(formData, {
        email: { required: true, pattern: ValidationPatterns.email },
        age: { required: true, min: 18, max: 120 },
        name: { required: true, minLength: 2 },
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect all errors', () => {
      const formData = {
        field1: '',
        field2: '',
        field3: '',
      };

      const result = validateForm(formData, {
        field1: { required: true, label: 'Field 1' },
        field2: { required: true, label: 'Field 2' },
        field3: { required: true, label: 'Field 3' },
      });

      expect(result.errors).toHaveLength(3);
      expect(result.errors.map(e => e.field)).toEqual(['field1', 'field2', 'field3']);
    });
  });

  describe('getFieldError', () => {
    it('should return error message for field', () => {
      const errors = [
        { field: 'email', message: 'Email is required' },
        { field: 'age', message: 'Age must be at least 18' },
      ];

      expect(getFieldError(errors, 'email')).toBe('Email is required');
      expect(getFieldError(errors, 'age')).toBe('Age must be at least 18');
      expect(getFieldError(errors, 'name')).toBeNull();
    });
  });

  describe('hasFieldError', () => {
    it('should check if field has error', () => {
      const errors = [
        { field: 'email', message: 'Email is required' },
      ];

      expect(hasFieldError(errors, 'email')).toBe(true);
      expect(hasFieldError(errors, 'age')).toBe(false);
    });
  });

  describe('getFormChanges', () => {
    it('should return only changed fields', () => {
      const original = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const updated = {
        name: 'John',
        email: 'newemail@example.com',
        age: 31,
      };

      const changes = getFormChanges(original, updated);

      expect(changes).toEqual({
        email: 'newemail@example.com',
        age: 31,
      });
      expect(changes.name).toBeUndefined();
    });

    it('should return empty object if no changes', () => {
      const original = { name: 'John', age: 30 };
      const updated = { name: 'John', age: 30 };

      const changes = getFormChanges(original, updated);

      expect(changes).toEqual({});
    });
  });

  describe('toFormData', () => {
    it('should convert object to FormData', () => {
      const data = {
        title: 'Test',
        count: 5,
        active: true,
      };

      const formData = toFormData(data);

      expect(formData.get('title')).toBe('Test');
      expect(formData.get('count')).toBe('5');
      expect(formData.get('active')).toBe('true');
    });

    it('should handle arrays with repeat format', () => {
      const data = {
        tags: ['tag1', 'tag2', 'tag3'],
      };

      const formData = toFormData(data, { arrayFormat: 'repeat' });
      const tags = formData.getAll('tags');

      expect(tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle arrays with brackets format', () => {
      const data = {
        tags: ['tag1', 'tag2'],
      };

      const formData = toFormData(data, { arrayFormat: 'brackets' });
      const tags = formData.getAll('tags[]');

      expect(tags).toEqual(['tag1', 'tag2']);
    });

    it('should handle File objects', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const data = {
        file,
      };

      const formData = toFormData(data);

      expect(formData.get('file')).toBeInstanceOf(File);
    });

    it('should skip null values by default', () => {
      const data = {
        name: 'John',
        age: null,
        email: undefined,
      };

      const formData = toFormData(data);

      expect(formData.has('name')).toBe(true);
      expect(formData.has('age')).toBe(false);
      expect(formData.has('email')).toBe(false);
    });

    it('should include null if configured', () => {
      const data = {
        name: 'John',
        age: null,
      };

      const formData = toFormData(data, { includeNull: true });

      expect(formData.has('age')).toBe(true);
      expect(formData.get('age')).toBe('null');
    });

    it('should stringify objects', () => {
      const data = {
        metadata: { key: 'value', count: 10 },
      };

      const formData = toFormData(data);

      expect(formData.get('metadata')).toBe('{"key":"value","count":10}');
    });
  });

  describe('sanitizeFormData', () => {
    it('should trim whitespace', () => {
      const data = {
        title: '  Test Title  ',
        description: 'Normal text',
      };

      const sanitized = sanitizeFormData(data);

      expect(sanitized.title).toBe('Test Title');
      expect(sanitized.description).toBe('Normal text');
    });

    it('should remove extra spaces', () => {
      const data = {
        text: 'Multiple   spaces   here',
      };

      const sanitized = sanitizeFormData(data);

      expect(sanitized.text).toBe('Multiple spaces here');
    });

    it('should only sanitize specified fields', () => {
      const data = {
        title: '  Title  ',
        description: '  Description  ',
        code: '  Code  ',
      };

      const sanitized = sanitizeFormData(data, ['title', 'description']);

      expect(sanitized.title).toBe('Title');
      expect(sanitized.description).toBe('Description');
      expect(sanitized.code).toBe('  Code  '); // Not sanitized
    });

    it('should preserve non-string values', () => {
      const data = {
        title: '  Title  ',
        count: 5,
        active: true,
      };

      const sanitized = sanitizeFormData(data);

      expect(sanitized.count).toBe(5);
      expect(sanitized.active).toBe(true);
    });
  });

  describe('getDefaultFormValues', () => {
    it('should create default values from schema', () => {
      const defaults = getDefaultFormValues({
        title: { required: true },
        description: { required: false },
      });

      expect(defaults.title).toBe('');
      expect(defaults.description).toBe('');
    });

    it('should use provided default values', () => {
      const defaults = getDefaultFormValues({
        title: { required: true, defaultValue: 'Default Title' },
        count: { required: true, defaultValue: 10 },
      });

      expect(defaults.title).toBe('Default Title');
      expect(defaults.count).toBe(10);
    });
  });

  describe('resetForm', () => {
    it('should reset form to initial values', () => {
      const initialValues = {
        name: 'John',
        email: 'john@example.com',
      };

      const reset = resetForm(initialValues);

      expect(reset).toEqual(initialValues);
      expect(reset).not.toBe(initialValues); // Should be a new object
    });
  });

  describe('ValidationPatterns', () => {
    it('should validate emails', () => {
      expect(ValidationPatterns.email.test('test@example.com')).toBe(true);
      expect(ValidationPatterns.email.test('invalid-email')).toBe(false);
      expect(ValidationPatterns.email.test('test@')).toBe(false);
      expect(ValidationPatterns.email.test('@example.com')).toBe(false);
    });

    it('should validate phone numbers', () => {
      expect(ValidationPatterns.phone.test('123-456-7890')).toBe(true);
      expect(ValidationPatterns.phone.test('(123) 456-7890')).toBe(true);
      expect(ValidationPatterns.phone.test('1234567890')).toBe(true);
      expect(ValidationPatterns.phone.test('+1-123-456-7890')).toBe(true);
      expect(ValidationPatterns.phone.test('invalid')).toBe(false);
    });

    it('should validate postal codes', () => {
      expect(ValidationPatterns.postalCode.test('A1B 2C3')).toBe(true);
      expect(ValidationPatterns.postalCode.test('A1B2C3')).toBe(true);
      expect(ValidationPatterns.postalCode.test('a1b 2c3')).toBe(true);
      expect(ValidationPatterns.postalCode.test('12345')).toBe(false);
    });

    it('should validate URLs', () => {
      expect(ValidationPatterns.url.test('https://example.com')).toBe(true);
      expect(ValidationPatterns.url.test('http://example.com')).toBe(true);
      expect(ValidationPatterns.url.test('https://sub.example.com/path?query=1')).toBe(true);
      expect(ValidationPatterns.url.test('example.com')).toBe(false);
      expect(ValidationPatterns.url.test('ftp://example.com')).toBe(false);
    });

    it('should validate strong passwords', () => {
      expect(ValidationPatterns.strongPassword.test('Test123!')).toBe(true);
      expect(ValidationPatterns.strongPassword.test('password')).toBe(false); // No uppercase/number/special
      expect(ValidationPatterns.strongPassword.test('PASSWORD')).toBe(false); // No lowercase/number/special
      expect(ValidationPatterns.strongPassword.test('Test1234')).toBe(false); // No special char
      expect(ValidationPatterns.strongPassword.test('Test!')).toBe(false); // Too short
    });

    it('should validate alphanumeric', () => {
      expect(ValidationPatterns.alphanumeric.test('abc123')).toBe(true);
      expect(ValidationPatterns.alphanumeric.test('abc-123')).toBe(false);
      expect(ValidationPatterns.alphanumeric.test('abc 123')).toBe(false);
    });

    it('should validate only numbers', () => {
      expect(ValidationPatterns.onlyNumbers.test('12345')).toBe(true);
      expect(ValidationPatterns.onlyNumbers.test('123abc')).toBe(false);
    });
  });

  describe('FieldValidators', () => {
    it('should create email validator', () => {
      const validator = FieldValidators.email('Email Address');
      
      expect(validator.required).toBe(true);
      expect(validator.pattern).toBe(ValidationPatterns.email);
      expect(validator.label).toBe('Email Address');
    });

    it('should create phone validator', () => {
      const required = FieldValidators.phone('Phone', true);
      const optional = FieldValidators.phone('Phone', false);
      
      expect(required.required).toBe(true);
      expect(optional.required).toBe(false);
    });

    it('should create password validator with requirements', () => {
      const validator = FieldValidators.password();
      
      expect(validator.required).toBe(true);
      expect(validator.minLength).toBe(8);
      expect(validator.pattern).toBe(ValidationPatterns.strongPassword);
      expect(validator.custom).toBeDefined();
    });

    it('should validate password requirements', () => {
      const validator = FieldValidators.password('Password');
      
      expect(validator.custom?.('Test123!')).toBeNull();
      expect(validator.custom?.('nouppercas1!')).toBe('Password must contain an uppercase letter');
      expect(validator.custom?.('NOLOWERCASE1!')).toBe('Password must contain a lowercase letter');
      expect(validator.custom?.('NoNumber!')).toBe('Password must contain a number');
      expect(validator.custom?.('NoSpecial1')).toBe('Password must contain a special character');
    });

    it('should create confirm password validator', () => {
      const validator = FieldValidators.confirmPassword('Test123!', 'Confirm');
      
      expect(validator.required).toBe(true);
      expect(validator.custom?.('Test123!')).toBeNull();
      expect(validator.custom?.('Different')).toBe('Passwords do not match');
    });

    it('should create future date validator', () => {
      const validator = FieldValidators.futureDate('Sale Date');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      expect(validator.custom?.(tomorrowStr)).toBeNull();
      expect(validator.custom?.(yesterdayStr)).toBe('Sale Date must be in the future');
    });

    it('should create number range validator', () => {
      const validator = FieldValidators.numberRange('Age', 18, 120, true);
      
      expect(validator.required).toBe(true);
      expect(validator.min).toBe(18);
      expect(validator.max).toBe(120);
    });

    it('should create required text validator', () => {
      const validator = FieldValidators.requiredText('Title', 3, 100);
      
      expect(validator.required).toBe(true);
      expect(validator.minLength).toBe(3);
      expect(validator.maxLength).toBe(100);
    });
  });
});

