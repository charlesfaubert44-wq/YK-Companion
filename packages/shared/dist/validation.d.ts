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
export declare const commonSchemas: {
    email: z.ZodString;
    url: z.ZodString;
    date: z.ZodString;
    uuid: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    phone: z.ZodString;
    postalCode: z.ZodString;
};
/**
 * Garage Sale validation schema
 */
export declare const garageSaleSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    address: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    start_date: z.ZodString;
    end_date: z.ZodString;
    items: z.ZodOptional<z.ZodArray<z.ZodString>>;
    contact_email: z.ZodOptional<z.ZodString>;
    contact_phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * User profile validation schema
 */
export declare const userProfileSchema: z.ZodObject<{
    full_name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    user_type: z.ZodOptional<z.ZodEnum<{
        visiting: "visiting";
        living: "living";
        moving: "moving";
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Premium Spotlight validation schema
 */
export declare const premiumSpotlightSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    business_name: z.ZodString;
    link_url: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    position: z.ZodEnum<{
        home_top: "home_top";
        home_middle: "home_middle";
        home_bottom: "home_bottom";
        visiting_top: "visiting_top";
        living_top: "living_top";
        moving_top: "moving_top";
    }>;
    start_date: z.ZodString;
    end_date: z.ZodString;
    amount_paid: z.ZodNumber;
    status: z.ZodEnum<{
        active: "active";
        pending: "pending";
        expired: "expired";
    }>;
}, z.core.$strip>;
/**
 * Knowledge base article validation schema
 */
export declare const knowledgeArticleSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    category: z.ZodEnum<{
        general: "general";
        housing: "housing";
        jobs: "jobs";
        transportation: "transportation";
        culture: "culture";
        weather: "weather";
        events: "events";
        services: "services";
    }>;
    language: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    is_featured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Contact form validation schema
 */
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
/**
 * Admin user permissions validation schema
 */
export declare const userPermissionsSchema: z.ZodObject<{
    userId: z.ZodString;
    is_super_admin: z.ZodOptional<z.ZodBoolean>;
    can_manage_users: z.ZodOptional<z.ZodBoolean>;
    can_manage_sponsors: z.ZodOptional<z.ZodBoolean>;
    can_manage_content: z.ZodOptional<z.ZodBoolean>;
    can_manage_garage_sales: z.ZodOptional<z.ZodBoolean>;
    can_view_analytics: z.ZodOptional<z.ZodBoolean>;
    can_manage_settings: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Validation result type (renamed to avoid conflict with forms.ts)
 */
export type ZodValidationResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodIssue[];
};
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
export declare function validateData<T>(data: unknown, schema: z.ZodSchema<T>): ZodValidationResult<T>;
/**
 * Async validation wrapper for async schemas
 */
export declare function validateDataAsync<T>(data: unknown, schema: z.ZodSchema<T>): Promise<ZodValidationResult<T>>;
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
export declare function formatValidationErrors(errors: z.ZodIssue[]): Record<string, string>;
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
export declare function withValidation<T>(request: Request, schema: z.ZodSchema<T>): Promise<{
    success: true;
    data: T;
} | {
    success: false;
    error: Response;
}>;
export type GarageSale = z.infer<typeof garageSaleSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type PremiumSpotlight = z.infer<typeof premiumSpotlightSchema>;
export type KnowledgeArticle = z.infer<typeof knowledgeArticleSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type UserPermissions = z.infer<typeof userPermissionsSchema>;
//# sourceMappingURL=validation.d.ts.map