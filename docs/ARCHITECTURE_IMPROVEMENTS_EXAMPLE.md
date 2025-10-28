# Architecture Improvements - Example API Route

This document shows how to use all the architecture improvements in practice.

## Before: Basic API Route

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('garage_sales')
      .insert(body);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Problems:**
- No input validation
- Poor error handling
- No type safety
- No error logging
- Inconsistent error format

---

## After: Improved API Route

```typescript
/**
 * Create Garage Sale API Route
 *
 * Implements all architecture best practices:
 * - Input validation with Zod
 * - Standardized error handling
 * - Type safety with TypeScript
 * - User-friendly error messages
 * - Proper HTTP status codes
 * - Error logging
 *
 * Architecture References:
 * - Security: Input validation (Arc42 4.4)
 * - Reliability: Error handling (Arc42 4.2)
 * - Usability: User-friendly messages (Arc42 4.3)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withValidation, garageSaleSchema } from '@yk-trip-planner/shared/validation';
import {
  withErrorHandling,
  CommonErrors,
  mapSupabaseError,
  createdResponse,
  assert,
} from '@/lib/api-errors';
import { requirePermission, logAdminActivity } from '@/lib/auth/admin';

export const POST = withErrorHandling(async (request: NextRequest) => {
  // 1. Validate input with Zod schema
  const validation = await withValidation(request, garageSaleSchema);
  if (!validation.success) {
    return validation.error;
  }

  const garageSaleData = validation.data;

  // 2. Check authentication
  const authCheck = await requirePermission('can_manage_garage_sales');
  if (authCheck instanceof NextResponse) {
    throw CommonErrors.Unauthorized();
  }

  const { user } = authCheck;
  assert(user, CommonErrors.Unauthorized());

  // 3. Create Supabase client
  const supabase = await createClient();

  // 4. Insert into database with error mapping
  const { data, error } = await supabase
    .from('garage_sales')
    .insert({
      ...garageSaleData,
      user_id: user.id,
      status: 'pending', // Requires admin approval
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  // 5. Log activity for audit trail
  await logAdminActivity(
    'create_garage_sale',
    'garage_sales',
    data.id,
    { created_by: user.id }
  );

  // 6. Return success response with proper status code
  return createdResponse({
    garageSale: data,
    message: 'Garage sale created successfully. Awaiting admin approval.',
  });
});
```

---

## Using the Improvements in Your Frontend

### 1. Error Boundary Usage

```typescript
// app/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### 2. Loading Skeletons Usage

```typescript
// app/garage-sales/page.tsx
import { Suspense } from 'react';
import { GarageSaleCardSkeleton, CardGridSkeleton } from '@/components/LoadingSkeleton';

export default function GarageSalesPage() {
  return (
    <div>
      <Suspense fallback={<CardGridSkeleton count={6} />}>
        <GarageSalesList />
      </Suspense>
    </div>
  );
}
```

### 3. API Retry Logic Usage

```typescript
// lib/api-client.ts
import { fetchWithRetry } from '@yk-trip-planner/shared/retry';

export async function getGarageSales() {
  const response = await fetchWithRetry('/api/garage-sales', {
    method: 'GET',
  }, {
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt) => {
      console.log(`Retrying API call, attempt ${attempt}`);
    },
  });

  return response.json();
}
```

### 4. Form Validation Usage

```typescript
// components/GarageSaleForm.tsx
import { useState } from 'react';
import { garageSaleSchema } from '@yk-trip-planner/shared/validation';

export default function GarageSaleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Client-side validation
    const result = garageSaleSchema.safeParse(data);

    if (!result.success) {
      const formatted = {};
      result.error.errors.forEach(err => {
        formatted[err.path.join('.')] = err.message;
      });
      setErrors(formatted);
      return;
    }

    // Submit to API
    try {
      const response = await fetch('/api/garage-sales', {
        method: 'POST',
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors(error.errors || { general: error.message });
        return;
      }

      // Success!
      alert('Garage sale created!');
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {errors.title && <span className="text-red-400">{errors.title}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## Architecture Benefits Achieved

### ✅ Security (from Arc42 4.4)
- **Input Validation:** Zod schemas prevent injection attacks
- **Type Safety:** TypeScript catches errors at compile time
- **Error Logging:** All errors are logged for monitoring

### ✅ Reliability (from Arc42 4.2)
- **Error Boundaries:** Prevent app crashes
- **Retry Logic:** Handle transient failures automatically
- **Standardized Errors:** Consistent error handling across app

### ✅ Usability (from Arc42 4.3)
- **Loading Skeletons:** Improve perceived performance
- **User-Friendly Errors:** Clear, actionable error messages
- **Instant Feedback:** Optimistic UI updates

### ✅ Maintainability
- **Type-Safe:** Fewer runtime errors
- **Reusable:** DRY principles with shared utilities
- **Clear Code:** Easy to understand and modify

---

## Cost Impact

All improvements use **zero additional infrastructure costs**:
- ✅ Client-side validation (no extra API calls)
- ✅ Retry logic (built into client)
- ✅ Error handling (no external service needed)
- ✅ Loading states (pure UI)

Stays within **free tier limits** while improving quality significantly!

---

## Next Steps

1. **Apply to existing API routes** - Update routes to use new patterns
2. **Add to component library** - Wrap components with Error Boundaries
3. **Update tests** - Test error cases and validation
4. **Monitor errors** - Set up error tracking (Sentry free tier)
5. **Document patterns** - Add to development guide

---

## References

- [Arc42 Solution Strategy](./architecture/arc42/04-solution-strategy.md)
- [ADR-0004: Row-Level Security](./architecture/adr/0004-row-level-security.md)
- [ADR-0008: TypeScript Everywhere](./architecture/adr/0008-typescript-everywhere.md)
