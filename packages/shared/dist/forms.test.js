"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for form utilities
 */
const vitest_1 = require("vitest");
const forms_1 = require("./forms");
(0, vitest_1.describe)('form utilities', () => {
    (0, vitest_1.describe)('validateField', () => {
        (0, vitest_1.it)('should validate required fields', () => {
            const error = (0, forms_1.validateField)('', { required: true, label: 'Email' }, 'email');
            (0, vitest_1.expect)(error).toBe('Email is required');
            const valid = (0, forms_1.validateField)('test@example.com', { required: true }, 'email');
            (0, vitest_1.expect)(valid).toBeNull();
        });
        (0, vitest_1.it)('should validate min and max length', () => {
            const tooShort = (0, forms_1.validateField)('ab', { minLength: 3, label: 'Name' }, 'name');
            (0, vitest_1.expect)(tooShort).toBe('Name must be at least 3 characters');
            const tooLong = (0, forms_1.validateField)('abcdefghij', { maxLength: 5, label: 'Code' }, 'code');
            (0, vitest_1.expect)(tooLong).toBe('Code must be no more than 5 characters');
            const valid = (0, forms_1.validateField)('abc', { minLength: 2, maxLength: 5 }, 'name');
            (0, vitest_1.expect)(valid).toBeNull();
        });
        (0, vitest_1.it)('should validate number ranges', () => {
            const tooLow = (0, forms_1.validateField)(5, { min: 10, label: 'Age' }, 'age');
            (0, vitest_1.expect)(tooLow).toBe('Age must be at least 10');
            const tooHigh = (0, forms_1.validateField)(150, { max: 120, label: 'Age' }, 'age');
            (0, vitest_1.expect)(tooHigh).toBe('Age must be no more than 120');
            const valid = (0, forms_1.validateField)(25, { min: 18, max: 120 }, 'age');
            (0, vitest_1.expect)(valid).toBeNull();
        });
        (0, vitest_1.it)('should validate patterns', () => {
            const invalid = (0, forms_1.validateField)('not-an-email', {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                label: 'Email',
            }, 'email');
            (0, vitest_1.expect)(invalid).toBe('Email format is invalid');
            const valid = (0, forms_1.validateField)('test@example.com', {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            }, 'email');
            (0, vitest_1.expect)(valid).toBeNull();
        });
        (0, vitest_1.it)('should validate with custom function', () => {
            const error = (0, forms_1.validateField)('test', {
                custom: (value) => value === 'forbidden' ? 'This value is forbidden' : null,
            }, 'field');
            (0, vitest_1.expect)(error).toBeNull();
            const invalid = (0, forms_1.validateField)('forbidden', {
                custom: (value) => value === 'forbidden' ? 'This value is forbidden' : null,
            }, 'field');
            (0, vitest_1.expect)(invalid).toBe('This value is forbidden');
        });
        (0, vitest_1.it)('should skip validations for empty optional fields', () => {
            const result = (0, forms_1.validateField)('', {
                required: false,
                minLength: 5,
            }, 'optional');
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should validate empty arrays as required', () => {
            const error = (0, forms_1.validateField)([], { required: true, label: 'Tags' }, 'tags');
            (0, vitest_1.expect)(error).toBe('Tags must have at least one item');
        });
        (0, vitest_1.it)('should trim whitespace for required validation', () => {
            const error = (0, forms_1.validateField)('   ', { required: true, label: 'Name' }, 'name');
            (0, vitest_1.expect)(error).toBe('Name is required');
        });
    });
    (0, vitest_1.describe)('validateForm', () => {
        (0, vitest_1.it)('should validate entire form object', () => {
            const formData = {
                email: 'invalid-email',
                age: 15,
                name: '',
            };
            const result = (0, forms_1.validateForm)(formData, {
                email: { required: true, pattern: forms_1.ValidationPatterns.email, label: 'Email' },
                age: { required: true, min: 18, label: 'Age' },
                name: { required: true, label: 'Name' },
            });
            (0, vitest_1.expect)(result.isValid).toBe(false);
            (0, vitest_1.expect)(result.errors).toHaveLength(3);
        });
        (0, vitest_1.it)('should return valid for correct data', () => {
            const formData = {
                email: 'test@example.com',
                age: 25,
                name: 'John Doe',
            };
            const result = (0, forms_1.validateForm)(formData, {
                email: { required: true, pattern: forms_1.ValidationPatterns.email },
                age: { required: true, min: 18, max: 120 },
                name: { required: true, minLength: 2 },
            });
            (0, vitest_1.expect)(result.isValid).toBe(true);
            (0, vitest_1.expect)(result.errors).toHaveLength(0);
        });
        (0, vitest_1.it)('should collect all errors', () => {
            const formData = {
                field1: '',
                field2: '',
                field3: '',
            };
            const result = (0, forms_1.validateForm)(formData, {
                field1: { required: true, label: 'Field 1' },
                field2: { required: true, label: 'Field 2' },
                field3: { required: true, label: 'Field 3' },
            });
            (0, vitest_1.expect)(result.errors).toHaveLength(3);
            (0, vitest_1.expect)(result.errors.map(e => e.field)).toEqual(['field1', 'field2', 'field3']);
        });
    });
    (0, vitest_1.describe)('getFieldError', () => {
        (0, vitest_1.it)('should return error message for field', () => {
            const errors = [
                { field: 'email', message: 'Email is required' },
                { field: 'age', message: 'Age must be at least 18' },
            ];
            (0, vitest_1.expect)((0, forms_1.getFieldError)(errors, 'email')).toBe('Email is required');
            (0, vitest_1.expect)((0, forms_1.getFieldError)(errors, 'age')).toBe('Age must be at least 18');
            (0, vitest_1.expect)((0, forms_1.getFieldError)(errors, 'name')).toBeNull();
        });
    });
    (0, vitest_1.describe)('hasFieldError', () => {
        (0, vitest_1.it)('should check if field has error', () => {
            const errors = [
                { field: 'email', message: 'Email is required' },
            ];
            (0, vitest_1.expect)((0, forms_1.hasFieldError)(errors, 'email')).toBe(true);
            (0, vitest_1.expect)((0, forms_1.hasFieldError)(errors, 'age')).toBe(false);
        });
    });
    (0, vitest_1.describe)('getFormChanges', () => {
        (0, vitest_1.it)('should return only changed fields', () => {
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
            const changes = (0, forms_1.getFormChanges)(original, updated);
            (0, vitest_1.expect)(changes).toEqual({
                email: 'newemail@example.com',
                age: 31,
            });
            (0, vitest_1.expect)(changes.name).toBeUndefined();
        });
        (0, vitest_1.it)('should return empty object if no changes', () => {
            const original = { name: 'John', age: 30 };
            const updated = { name: 'John', age: 30 };
            const changes = (0, forms_1.getFormChanges)(original, updated);
            (0, vitest_1.expect)(changes).toEqual({});
        });
    });
    (0, vitest_1.describe)('toFormData', () => {
        (0, vitest_1.it)('should convert object to FormData', () => {
            const data = {
                title: 'Test',
                count: 5,
                active: true,
            };
            const formData = (0, forms_1.toFormData)(data);
            (0, vitest_1.expect)(formData.get('title')).toBe('Test');
            (0, vitest_1.expect)(formData.get('count')).toBe('5');
            (0, vitest_1.expect)(formData.get('active')).toBe('true');
        });
        (0, vitest_1.it)('should handle arrays with repeat format', () => {
            const data = {
                tags: ['tag1', 'tag2', 'tag3'],
            };
            const formData = (0, forms_1.toFormData)(data, { arrayFormat: 'repeat' });
            const tags = formData.getAll('tags');
            (0, vitest_1.expect)(tags).toEqual(['tag1', 'tag2', 'tag3']);
        });
        (0, vitest_1.it)('should handle arrays with brackets format', () => {
            const data = {
                tags: ['tag1', 'tag2'],
            };
            const formData = (0, forms_1.toFormData)(data, { arrayFormat: 'brackets' });
            const tags = formData.getAll('tags[]');
            (0, vitest_1.expect)(tags).toEqual(['tag1', 'tag2']);
        });
        (0, vitest_1.it)('should handle File objects', () => {
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            const data = {
                file,
            };
            const formData = (0, forms_1.toFormData)(data);
            (0, vitest_1.expect)(formData.get('file')).toBeInstanceOf(File);
        });
        (0, vitest_1.it)('should skip null values by default', () => {
            const data = {
                name: 'John',
                age: null,
                email: undefined,
            };
            const formData = (0, forms_1.toFormData)(data);
            (0, vitest_1.expect)(formData.has('name')).toBe(true);
            (0, vitest_1.expect)(formData.has('age')).toBe(false);
            (0, vitest_1.expect)(formData.has('email')).toBe(false);
        });
        (0, vitest_1.it)('should include null if configured', () => {
            const data = {
                name: 'John',
                age: null,
            };
            const formData = (0, forms_1.toFormData)(data, { includeNull: true });
            (0, vitest_1.expect)(formData.has('age')).toBe(true);
            (0, vitest_1.expect)(formData.get('age')).toBe('null');
        });
        (0, vitest_1.it)('should stringify objects', () => {
            const data = {
                metadata: { key: 'value', count: 10 },
            };
            const formData = (0, forms_1.toFormData)(data);
            (0, vitest_1.expect)(formData.get('metadata')).toBe('{"key":"value","count":10}');
        });
    });
    (0, vitest_1.describe)('sanitizeFormData', () => {
        (0, vitest_1.it)('should trim whitespace', () => {
            const data = {
                title: '  Test Title  ',
                description: 'Normal text',
            };
            const sanitized = (0, forms_1.sanitizeFormData)(data);
            (0, vitest_1.expect)(sanitized.title).toBe('Test Title');
            (0, vitest_1.expect)(sanitized.description).toBe('Normal text');
        });
        (0, vitest_1.it)('should remove extra spaces', () => {
            const data = {
                text: 'Multiple   spaces   here',
            };
            const sanitized = (0, forms_1.sanitizeFormData)(data);
            (0, vitest_1.expect)(sanitized.text).toBe('Multiple spaces here');
        });
        (0, vitest_1.it)('should only sanitize specified fields', () => {
            const data = {
                title: '  Title  ',
                description: '  Description  ',
                code: '  Code  ',
            };
            const sanitized = (0, forms_1.sanitizeFormData)(data, ['title', 'description']);
            (0, vitest_1.expect)(sanitized.title).toBe('Title');
            (0, vitest_1.expect)(sanitized.description).toBe('Description');
            (0, vitest_1.expect)(sanitized.code).toBe('  Code  '); // Not sanitized
        });
        (0, vitest_1.it)('should preserve non-string values', () => {
            const data = {
                title: '  Title  ',
                count: 5,
                active: true,
            };
            const sanitized = (0, forms_1.sanitizeFormData)(data);
            (0, vitest_1.expect)(sanitized.count).toBe(5);
            (0, vitest_1.expect)(sanitized.active).toBe(true);
        });
    });
    (0, vitest_1.describe)('getDefaultFormValues', () => {
        (0, vitest_1.it)('should create default values from schema', () => {
            const defaults = (0, forms_1.getDefaultFormValues)({
                title: { required: true },
                description: { required: false },
            });
            (0, vitest_1.expect)(defaults.title).toBe('');
            (0, vitest_1.expect)(defaults.description).toBe('');
        });
        (0, vitest_1.it)('should use provided default values', () => {
            const defaults = (0, forms_1.getDefaultFormValues)({
                title: { required: true, defaultValue: 'Default Title' },
                count: { required: true, defaultValue: 10 },
            });
            (0, vitest_1.expect)(defaults.title).toBe('Default Title');
            (0, vitest_1.expect)(defaults.count).toBe(10);
        });
    });
    (0, vitest_1.describe)('resetForm', () => {
        (0, vitest_1.it)('should reset form to initial values', () => {
            const initialValues = {
                name: 'John',
                email: 'john@example.com',
            };
            const reset = (0, forms_1.resetForm)(initialValues);
            (0, vitest_1.expect)(reset).toEqual(initialValues);
            (0, vitest_1.expect)(reset).not.toBe(initialValues); // Should be a new object
        });
    });
    (0, vitest_1.describe)('ValidationPatterns', () => {
        (0, vitest_1.it)('should validate emails', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.email.test('test@example.com')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.email.test('invalid-email')).toBe(false);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.email.test('test@')).toBe(false);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.email.test('@example.com')).toBe(false);
        });
        (0, vitest_1.it)('should validate phone numbers', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.phone.test('123-456-7890')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.phone.test('(123) 456-7890')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.phone.test('1234567890')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.phone.test('+1-123-456-7890')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.phone.test('invalid')).toBe(false);
        });
        (0, vitest_1.it)('should validate postal codes', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.postalCode.test('A1B 2C3')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.postalCode.test('A1B2C3')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.postalCode.test('a1b 2c3')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.postalCode.test('12345')).toBe(false);
        });
        (0, vitest_1.it)('should validate URLs', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.url.test('https://example.com')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.url.test('http://example.com')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.url.test('https://sub.example.com/path?query=1')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.url.test('example.com')).toBe(false);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.url.test('ftp://example.com')).toBe(false);
        });
        (0, vitest_1.it)('should validate strong passwords', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.strongPassword.test('Test123!')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.strongPassword.test('password')).toBe(false); // No uppercase/number/special
            (0, vitest_1.expect)(forms_1.ValidationPatterns.strongPassword.test('PASSWORD')).toBe(false); // No lowercase/number/special
            (0, vitest_1.expect)(forms_1.ValidationPatterns.strongPassword.test('Test1234')).toBe(false); // No special char
            (0, vitest_1.expect)(forms_1.ValidationPatterns.strongPassword.test('Test!')).toBe(false); // Too short
        });
        (0, vitest_1.it)('should validate alphanumeric', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.alphanumeric.test('abc123')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.alphanumeric.test('abc-123')).toBe(false);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.alphanumeric.test('abc 123')).toBe(false);
        });
        (0, vitest_1.it)('should validate only numbers', () => {
            (0, vitest_1.expect)(forms_1.ValidationPatterns.onlyNumbers.test('12345')).toBe(true);
            (0, vitest_1.expect)(forms_1.ValidationPatterns.onlyNumbers.test('123abc')).toBe(false);
        });
    });
    (0, vitest_1.describe)('FieldValidators', () => {
        (0, vitest_1.it)('should create email validator', () => {
            const validator = forms_1.FieldValidators.email('Email Address');
            (0, vitest_1.expect)(validator.required).toBe(true);
            (0, vitest_1.expect)(validator.pattern).toBe(forms_1.ValidationPatterns.email);
            (0, vitest_1.expect)(validator.label).toBe('Email Address');
        });
        (0, vitest_1.it)('should create phone validator', () => {
            const required = forms_1.FieldValidators.phone('Phone', true);
            const optional = forms_1.FieldValidators.phone('Phone', false);
            (0, vitest_1.expect)(required.required).toBe(true);
            (0, vitest_1.expect)(optional.required).toBe(false);
        });
        (0, vitest_1.it)('should create password validator with requirements', () => {
            const validator = forms_1.FieldValidators.password();
            (0, vitest_1.expect)(validator.required).toBe(true);
            (0, vitest_1.expect)(validator.minLength).toBe(8);
            (0, vitest_1.expect)(validator.pattern).toBe(forms_1.ValidationPatterns.strongPassword);
            (0, vitest_1.expect)(validator.custom).toBeDefined();
        });
        (0, vitest_1.it)('should validate password requirements', () => {
            const validator = forms_1.FieldValidators.password('Password');
            (0, vitest_1.expect)(validator.custom?.('Test123!')).toBeNull();
            (0, vitest_1.expect)(validator.custom?.('nouppercas1!')).toBe('Password must contain an uppercase letter');
            (0, vitest_1.expect)(validator.custom?.('NOLOWERCASE1!')).toBe('Password must contain a lowercase letter');
            (0, vitest_1.expect)(validator.custom?.('NoNumber!')).toBe('Password must contain a number');
            (0, vitest_1.expect)(validator.custom?.('NoSpecial1')).toBe('Password must contain a special character');
        });
        (0, vitest_1.it)('should create confirm password validator', () => {
            const validator = forms_1.FieldValidators.confirmPassword('Test123!', 'Confirm');
            (0, vitest_1.expect)(validator.required).toBe(true);
            (0, vitest_1.expect)(validator.custom?.('Test123!')).toBeNull();
            (0, vitest_1.expect)(validator.custom?.('Different')).toBe('Passwords do not match');
        });
        (0, vitest_1.it)('should create future date validator', () => {
            const validator = forms_1.FieldValidators.futureDate('Sale Date');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            (0, vitest_1.expect)(validator.custom?.(tomorrowStr)).toBeNull();
            (0, vitest_1.expect)(validator.custom?.(yesterdayStr)).toBe('Sale Date must be in the future');
        });
        (0, vitest_1.it)('should create number range validator', () => {
            const validator = forms_1.FieldValidators.numberRange('Age', 18, 120, true);
            (0, vitest_1.expect)(validator.required).toBe(true);
            (0, vitest_1.expect)(validator.min).toBe(18);
            (0, vitest_1.expect)(validator.max).toBe(120);
        });
        (0, vitest_1.it)('should create required text validator', () => {
            const validator = forms_1.FieldValidators.requiredText('Title', 3, 100);
            (0, vitest_1.expect)(validator.required).toBe(true);
            (0, vitest_1.expect)(validator.minLength).toBe(3);
            (0, vitest_1.expect)(validator.maxLength).toBe(100);
        });
    });
});
//# sourceMappingURL=forms.test.js.map