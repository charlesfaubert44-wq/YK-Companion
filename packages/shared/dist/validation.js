"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPermissionsSchema = exports.contactFormSchema = exports.knowledgeArticleSchema = exports.premiumSpotlightSchema = exports.userProfileSchema = exports.garageSaleSchema = exports.commonSchemas = void 0;
exports.validateData = validateData;
exports.validateDataAsync = validateDataAsync;
exports.formatValidationErrors = formatValidationErrors;
exports.withValidation = withValidation;
const zod_1 = require("zod");
/**
 * Common validation utilities
 */
exports.commonSchemas = {
    // Email validation
    email: zod_1.z.string().email('Invalid email address'),
    // URL validation
    url: zod_1.z.string().url('Invalid URL'),
    // Date validation
    date: zod_1.z.string().datetime('Invalid date format'),
    // UUID validation
    uuid: zod_1.z.string().uuid('Invalid UUID'),
    // Coordinates validation
    latitude: zod_1.z.number().min(-90).max(90, 'Invalid latitude'),
    longitude: zod_1.z.number().min(-180).max(180, 'Invalid longitude'),
    // Phone number (basic validation)
    phone: zod_1.z.string().regex(/^\+?[\d\s()-]+$/, 'Invalid phone number'),
    // Postal code (Canadian format)
    postalCode: zod_1.z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code'),
};
/**
 * Garage Sale validation schema
 */
exports.garageSaleSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
    address: zod_1.z.string().min(5, 'Address required'),
    latitude: exports.commonSchemas.latitude,
    longitude: exports.commonSchemas.longitude,
    start_date: exports.commonSchemas.date,
    end_date: exports.commonSchemas.date,
    items: zod_1.z.array(zod_1.z.string()).optional(),
    contact_email: exports.commonSchemas.email.optional(),
    contact_phone: exports.commonSchemas.phone.optional(),
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
});
/**
 * User profile validation schema
 */
exports.userProfileSchema = zod_1.z.object({
    full_name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    address: zod_1.z.string().max(500, 'Address too long').optional(),
    user_type: zod_1.z.enum(['visiting', 'living', 'moving']).optional(),
    preferences: zod_1.z.object({
        language: zod_1.z.string().optional(),
        notifications: zod_1.z.boolean().optional(),
    }).optional(),
});
/**
 * Premium Spotlight validation schema
 */
exports.premiumSpotlightSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10).max(1000),
    business_name: zod_1.z.string().min(2).max(200),
    link_url: exports.commonSchemas.url,
    image_url: exports.commonSchemas.url.optional(),
    position: zod_1.z.enum(['home_top', 'home_middle', 'home_bottom', 'visiting_top', 'living_top', 'moving_top']),
    start_date: exports.commonSchemas.date,
    end_date: exports.commonSchemas.date,
    amount_paid: zod_1.z.number().positive('Amount must be positive'),
    status: zod_1.z.enum(['pending', 'active', 'expired']),
});
/**
 * Knowledge base article validation schema
 */
exports.knowledgeArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(300),
    content: zod_1.z.string().min(50).max(50000),
    category: zod_1.z.enum(['general', 'housing', 'jobs', 'transportation', 'culture', 'weather', 'events', 'services']),
    language: zod_1.z.string().length(2, 'Language code must be 2 characters'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    is_featured: zod_1.z.boolean().optional(),
});
/**
 * Contact form validation schema
 */
exports.contactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: exports.commonSchemas.email,
    subject: zod_1.z.string().min(5, 'Subject must be at least 5 characters').max(200),
    message: zod_1.z.string().min(20, 'Message must be at least 20 characters').max(5000),
});
/**
 * Admin user permissions validation schema
 */
exports.userPermissionsSchema = zod_1.z.object({
    userId: exports.commonSchemas.uuid,
    is_super_admin: zod_1.z.boolean().optional(),
    can_manage_users: zod_1.z.boolean().optional(),
    can_manage_sponsors: zod_1.z.boolean().optional(),
    can_manage_content: zod_1.z.boolean().optional(),
    can_manage_garage_sales: zod_1.z.boolean().optional(),
    can_view_analytics: zod_1.z.boolean().optional(),
    can_manage_settings: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
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
function validateData(data, schema) {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return { success: false, errors: error.issues };
        }
        throw error;
    }
}
/**
 * Async validation wrapper for async schemas
 */
async function validateDataAsync(data, schema) {
    try {
        const validatedData = await schema.parseAsync(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
function formatValidationErrors(errors) {
    const formatted = {};
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
async function withValidation(request, schema) {
    try {
        const body = await request.json();
        const result = validateData(body, schema);
        if (!result.success) {
            const errors = formatValidationErrors(result.errors);
            return {
                success: false,
                error: new Response(JSON.stringify({ error: 'Validation failed', errors }), { status: 400, headers: { 'Content-Type': 'application/json' } }),
            };
        }
        return { success: true, data: result.data };
    }
    catch (error) {
        return {
            success: false,
            error: new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } }),
        };
    }
}
//# sourceMappingURL=validation.js.map