/**
 * Input Validation with Zod
 *
 * Architecture Reference: Arc42 Section 4.4 - Security Strategy
 * Implements input validation with Zod schemas on API routes
 *
 * Security Benefits:
 * - Prevents injection attacks
 * - Validates data types and formats
 * - Provides clear error messages
 * - Type-safe validation
 *
 * @example
 * import { garageSaleSchema } from '@yk-trip-planner/shared/validation';
 *
 * const result = await validateRequest(req.body, garageSaleSchema);
 * if (!result.success) {
 *   return NextResponse.json({ errors: result.errors }, { status: 400 });
 * }
 */

import { z } from 'zod';

/**
 * Common validation utilities
 */
export const commonSchemas = {
  // Email validation
  email: z.string().email('Invalid email address'),

  // URL validation
  url: z.string().url('Invalid URL'),

  // Date validation
  date: z.string().datetime('Invalid date format'),

  // UUID validation
  uuid: z.string().uuid('Invalid UUID'),

  // Coordinates validation
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),

  // Phone number (basic validation)
  phone: z.string().regex(/^\+?[\d\s()-]+$/, 'Invalid phone number'),

  // Postal code (Canadian format)
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code'),
};

/**
 * Garage Sale validation schema
 */
export const garageSaleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  address: z.string().min(5, 'Address required'),
  latitude: commonSchemas.latitude,
  longitude: commonSchemas.longitude,
  start_date: commonSchemas.date,
  end_date: commonSchemas.date,
  items: z.array(z.string()).optional(),
  contact_email: commonSchemas.email.optional(),
  contact_phone: commonSchemas.phone.optional(),
}).refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);

/**
 * User profile validation schema
 */
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  address: z.string().max(500, 'Address too long').optional(),
  user_type: z.enum(['visiting', 'living', 'moving']).optional(),
  preferences: z.object({
    language: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

/**
 * Premium Spotlight validation schema
 */
export const premiumSpotlightSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  business_name: z.string().min(2).max(200),
  link_url: commonSchemas.url,
  image_url: commonSchemas.url.optional(),
  position: z.enum(['home_top', 'home_middle', 'home_bottom', 'visiting_top', 'living_top', 'moving_top']),
  start_date: commonSchemas.date,
  end_date: commonSchemas.date,
  amount_paid: z.number().positive('Amount must be positive'),
  status: z.enum(['pending', 'active', 'expired']),
});

/**
 * Knowledge base article validation schema
 */
export const knowledgeArticleSchema = z.object({
  title: z.string().min(5).max(300),
  content: z.string().min(50).max(50000),
  category: z.enum(['general', 'housing', 'jobs', 'transportation', 'culture', 'weather', 'events', 'services']),
  language: z.string().length(2, 'Language code must be 2 characters'),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
});

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: commonSchemas.email,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
});

/**
 * Admin user permissions validation schema
 */
export const userPermissionsSchema = z.object({
  userId: commonSchemas.uuid,
  is_super_admin: z.boolean().optional(),
  can_manage_users: z.boolean().optional(),
  can_manage_sponsors: z.boolean().optional(),
  can_manage_content: z.boolean().optional(),
  can_manage_garage_sales: z.boolean().optional(),
  can_view_analytics: z.boolean().optional(),
  can_manage_settings: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Validation result type (renamed to avoid conflict with forms.ts)
 */
export type ZodValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: z.ZodIssue[] };

/**
 * Validate data against a Zod schema
 *
 * @param data Data to validate
 * @param schema Zod schema
 * @returns Validation result with typed data or errors
 *
 * @example
 * const result = validateData(req.body, garageSaleSchema);
 * if (!result.success) {
 *   return NextResponse.json({ errors: result.errors }, { status: 400 });
 * }
 * // result.data is now typed as GarageSale
 * const garageSale = result.data;
 */
export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ZodValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    throw error;
  }
}

/**
 * Async validation wrapper for async schemas
 */
export async function validateDataAsync<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<ZodValidationResult<T>> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    throw error;
  }
}

/**
 * Format Zod errors for user-friendly display
 *
 * @param errors Zod errors array
 * @returns Formatted error messages
 *
 * @example
 * const result = validateData(data, schema);
 * if (!result.success) {
 *   const messages = formatValidationErrors(result.errors);
 *   // { email: "Invalid email address", name: "Name is required" }
 * }
 */
export function formatValidationErrors(
  errors: z.ZodIssue[]
): Record<string, string> {
  const formatted: Record<string, string> = {};

  for (const error of errors) {
    const path = error.path.join('.');
    formatted[path] = error.message;
  }

  return formatted;
}

/**
 * Create a validation middleware for Next.js API routes
 *
 * @param schema Zod schema to validate against
 * @returns Validation middleware function
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   const validation = await withValidation(request, garageSaleSchema);
 *   if (!validation.success) {
 *     return validation.error;
 *   }
 *
 *   const data = validation.data;
 *   // ... use validated data
 * }
 */
export async function withValidation<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<
  | { success: true; data: T }
  | { success: false; error: Response }
> {
  try {
    const body = await request.json();
    const result = validateData(body, schema);

    if (!result.success) {
      const errors = formatValidationErrors(result.errors);
      return {
        success: false,
        error: new Response(
          JSON.stringify({ error: 'Validation failed', errors }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}

// Export types inferred from schemas
export type GarageSale = z.infer<typeof garageSaleSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type PremiumSpotlight = z.infer<typeof premiumSpotlightSchema>;
export type KnowledgeArticle = z.infer<typeof knowledgeArticleSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type UserPermissions = z.infer<typeof userPermissionsSchema>;
