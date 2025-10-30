import { z } from 'zod';

/**
 * Validation schemas for user inputs
 * Prevents injection attacks and ensures data integrity
 */

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(3, 'Email must be at least 3 characters')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

// Name validation (prevents XSS)
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

// URL validation
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2000, 'URL must be less than 2000 characters')
  .refine(
    url => url.startsWith('https://') || url.startsWith('http://'),
    'URL must start with http:// or https://'
  );

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

// Address validation
export const addressSchema = z
  .string()
  .min(5, 'Address must be at least 5 characters')
  .max(500, 'Address must be less than 500 characters')
  .trim()
  .optional();

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize user input
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input) return '';

  return input.trim().slice(0, maxLength).replace(/[<>]/g, ''); // Remove angle brackets
}

// Form validation schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  address: addressSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim()
    .optional(),
});

// Garage sale validation
export const garageSaleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  startDate: z.date(),
  endDate: z.date(),
  contactInfo: z
    .string()
    .max(200, 'Contact info must be less than 200 characters')
    .trim()
    .optional(),
});

// Premium sponsor validation
export const premiumSponsorSchema = z.object({
  name: nameSchema,
  tagline: z
    .string()
    .min(3, 'Tagline must be at least 3 characters')
    .max(200, 'Tagline must be less than 200 characters')
    .trim(),
  link: urlSchema,
  position: z.enum(['home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving']),
  startDate: z.date(),
  endDate: z.date(),
});
