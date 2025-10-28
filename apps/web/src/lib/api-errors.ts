/**
 * API Error Handling Utilities
 *
 * Architecture Reference: Arc42 Section 4.3 - Usability & Reliability Strategy
 * Implements user-friendly error handling and standardized error responses
 *
 * Benefits:
 * - Consistent error format across all API routes
 * - User-friendly error messages
 * - Proper HTTP status codes
 * - Error logging for monitoring
 * - Type-safe error handling
 */

import { NextResponse } from 'next/server';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: any;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Predefined common API errors
 */
export const CommonErrors = {
  // Client errors (4xx)
  BadRequest: (message = 'Bad request', details?: any) =>
    new ApiError(400, message, details),

  Unauthorized: (message = 'Authentication required') =>
    new ApiError(401, message),

  Forbidden: (message = 'Access denied') =>
    new ApiError(403, message),

  NotFound: (resource = 'Resource') =>
    new ApiError(404, `${resource} not found`),

  Conflict: (message = 'Resource already exists') =>
    new ApiError(409, message),

  ValidationError: (errors: Record<string, string>) =>
    new ApiError(422, 'Validation failed', { errors }),

  // Server errors (5xx)
  InternalError: (message = 'Internal server error') =>
    new ApiError(500, message),

  NotImplemented: (message = 'Feature not implemented') =>
    new ApiError(501, message),

  ServiceUnavailable: (message = 'Service temporarily unavailable') =>
    new ApiError(503, message),
};

/**
 * Create a standardized error response
 *
 * @param error Error object
 * @param path Optional request path
 * @returns NextResponse with error details
 */
export function createErrorResponse(
  error: unknown,
  path?: string
): NextResponse<ApiErrorResponse> {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    const response: ApiErrorResponse = {
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
      path,
      details: error.details,
    };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', response);
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    const response: ApiErrorResponse = {
      error: 'InternalServerError',
      message: process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path,
    };

    console.error('[Unexpected Error]', error);

    return NextResponse.json(response, { status: 500 });
  }

  // Handle unknown error types
  const response: ApiErrorResponse = {
    error: 'UnknownError',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    path,
  };

  console.error('[Unknown Error]', error);

  return NextResponse.json(response, { status: 500 });
}

/**
 * Wrap API route handler with error handling
 *
 * @param handler API route handler function
 * @returns Wrapped handler with automatic error handling
 *
 * @example
 * export const POST = withErrorHandling(async (request) => {
 *   // Your API logic here
 *   // Any thrown errors will be caught and formatted automatically
 *   const data = await someOperation();
 *   return NextResponse.json({ success: true, data });
 * });
 */
export function withErrorHandling(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const url = new URL(request.url);
      return createErrorResponse(error, url.pathname);
    }
  };
}

/**
 * Supabase error mapper - converts Supabase errors to ApiErrors
 *
 * @param error Supabase error
 * @returns ApiError
 */
export function mapSupabaseError(error: any): ApiError {
  // PGRST116 - Row not found
  if (error.code === 'PGRST116') {
    return CommonErrors.NotFound('Resource');
  }

  // PGRST301 - Permission denied (RLS)
  if (error.code === 'PGRST301') {
    return CommonErrors.Forbidden('You do not have permission to access this resource');
  }

  // 23505 - Unique constraint violation
  if (error.code === '23505') {
    return CommonErrors.Conflict('Resource already exists');
  }

  // 23503 - Foreign key violation
  if (error.code === '23503') {
    return CommonErrors.BadRequest('Invalid reference to related resource');
  }

  // 42501 - Insufficient privilege
  if (error.code === '42501') {
    return CommonErrors.Forbidden('Insufficient privileges');
  }

  // Generic Supabase error
  return CommonErrors.InternalError(
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'Database operation failed'
  );
}

/**
 * Success response helper
 *
 * @param data Response data
 * @param status HTTP status code (default: 200)
 * @returns NextResponse with success data
 *
 * @example
 * return successResponse({ garageSales: sales });
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<{ success: true; data: T }> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

/**
 * Created response helper (201)
 *
 * @param data Created resource data
 * @returns NextResponse with 201 status
 */
export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201);
}

/**
 * No content response helper (204)
 *
 * @returns NextResponse with 204 status
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Assert condition or throw error
 *
 * @param condition Condition to check
 * @param error Error to throw if condition is false
 *
 * @example
 * assert(userId, CommonErrors.Unauthorized());
 * assert(user.isAdmin, CommonErrors.Forbidden());
 */
export function assert(condition: any, error: ApiError): asserts condition {
  if (!condition) {
    throw error;
  }
}

/**
 * Rate limit error helper
 *
 * @param retryAfter Seconds to wait before retry
 * @returns NextResponse with 429 status
 */
export function rateLimitError(retryAfter: number = 60): NextResponse {
  return NextResponse.json(
    {
      error: 'TooManyRequests',
      message: 'Rate limit exceeded. Please try again later.',
      statusCode: 429,
      timestamp: new Date().toISOString(),
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Maintenance mode error helper
 *
 * @param message Optional maintenance message
 * @returns NextResponse with 503 status
 */
export function maintenanceError(
  message: string = 'System is currently under maintenance'
): NextResponse {
  return NextResponse.json(
    {
      error: 'ServiceUnavailable',
      message,
      statusCode: 503,
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );
}
