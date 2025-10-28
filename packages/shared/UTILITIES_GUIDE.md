# YK Companion - Utility Functions Guide

This guide documents all utility functions available in the `@yk-trip-planner/shared` package and the web app's `src/lib` directory.

## Table of Contents

1. [Async & Promise Utilities](#async--promise-utilities)
2. [Form Utilities](#form-utilities)
3. [Query Parameter Utilities](#query-parameter-utilities)
4. [Date & Time Utilities](#date--time-utilities)
5. [React Hooks (Web App)](#react-hooks-web-app)
6. [Existing Utilities](#existing-utilities)

---

## Async & Promise Utilities

Located in: `packages/shared/src/async.ts`

### `safeAsync<T, E>(promise)`
Safely execute async functions without throwing errors.
```typescript
const result = await safeAsync(() => fetchUserData(userId));
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### `retryWithBackoff<T>(fn, options)`
Retry failed async operations with exponential backoff.
```typescript
const data = await retryWithBackoff(
  () => fetch('/api/data'),
  {
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
  }
);
```

### `asyncPool<T, R>(items, fn, concurrencyLimit)`
Execute async operations with concurrency control.
```typescript
// Fetch 100 items, max 5 concurrent requests
const results = await asyncPool(
  saleIds,
  (id) => fetchGarageSale(id),
  5
);
```

### `withTimeout<T>(promise, timeoutMs, errorMsg?)`
Add timeout to any promise.
```typescript
const data = await withTimeout(
  fetchLargeDataset(),
  5000,
  'Request took too long'
);
```

### `debounceAsync<T>(fn, delayMs)`
Debounce async functions (useful for search).
```typescript
const debouncedSearch = debounceAsync(
  (query: string) => searchGarageSales(query),
  300
);
```

### `pollUntil<T>(fn, condition, options)`
Poll until condition is met.
```typescript
const jobResult = await pollUntil(
  () => checkJobStatus(jobId),
  (status) => status === 'completed',
  { interval: 1000, timeout: 30000 }
);
```

### `asyncCache<T>(fn, ttlMs)`
Cache async function results.
```typescript
const getCachedWeather = asyncCache(
  () => fetchWeatherData(),
  5 * 60 * 1000 // Cache for 5 minutes
);
```

---

## Form Utilities

Located in: `packages/shared/src/forms.ts`

### `validateForm<T>(formData, schema)`
Validate entire form objects.
```typescript
const result = validateForm(formData, {
  email: { required: true, pattern: ValidationPatterns.email },
  age: { required: true, min: 18, max: 120 }
});

if (!result.isValid) {
  result.errors.forEach(err => console.error(err.message));
}
```

### `validateField<T>(value, config, fieldName)`
Validate single form field.
```typescript
const error = validateField(email, {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  label: 'Email'
}, 'email');
```

### `FieldValidators` (Pre-built validators)
```typescript
// Email
const emailConfig = FieldValidators.email('Email Address');

// Phone
const phoneConfig = FieldValidators.phone('Phone', true);

// Password with strength requirements
const passwordConfig = FieldValidators.password('Password');

// Confirm password
const confirmConfig = FieldValidators.confirmPassword(password, 'Confirm');

// Future date
const dateConfig = FieldValidators.futureDate('Sale Date');

// Number range
const priceConfig = FieldValidators.numberRange('Price', 0, 10000);
```

### `ValidationPatterns` (Common regex patterns)
```typescript
ValidationPatterns.email
ValidationPatterns.phone
ValidationPatterns.postalCode
ValidationPatterns.url
ValidationPatterns.strongPassword
```

### `toFormData(data, options?)`
Convert object to FormData for file uploads.
```typescript
const formData = toFormData({
  title: 'Garage Sale',
  photos: [file1, file2],
  tags: ['furniture', 'tools']
});
```

### `getFormChanges<T>(original, updated)`
Get only changed fields (for partial updates).
```typescript
const changes = getFormChanges(originalProfile, updatedProfile);
await updateProfile(userId, changes); // Only send what changed
```

---

## Query Parameter Utilities

Located in: `packages/shared/src/query-params.ts`

### `parseQueryString(queryString)`
Parse query string into object.
```typescript
const params = parseQueryString('?search=furniture&tags=tools&tags=outdoor');
// { search: 'furniture', tags: ['tools', 'outdoor'] }
```

### `buildQueryString(params, options?)`
Build query string from object.
```typescript
const qs = buildQueryString({
  search: 'furniture',
  tags: ['tools', 'outdoor'],
  page: 1
});
// "?search=furniture&tags=tools&tags=outdoor&page=1"
```

### `parseTypedQueryParams<T>(queryString, schema)`
Parse and validate typed query parameters.
```typescript
const params = parseTypedQueryParams(location.search, {
  search: { type: 'string', default: '' },
  page: { type: 'number', default: 1, min: 1 },
  tags: { type: 'array', default: [] },
  active: { type: 'boolean', default: true }
});
// All parameters are properly typed and validated
```

### `updateQueryParams(url, updates, remove?)`
Update query parameters in URL.
```typescript
const newUrl = updateQueryParams(
  '/garage-sales?page=1&limit=10',
  { page: 2, search: 'furniture' },
  ['limit']
);
// "/garage-sales?page=2&search=furniture"
```

### `slugify(text, options?)`
Create URL-safe slugs.
```typescript
const slug = slugify('Garage Sale - Furniture & Tools!');
// "garage-sale-furniture-tools"
```

### `encodeObjectToUrl(obj)` / `decodeUrlToObject<T>(encoded)`
Encode/decode complex state in URLs.
```typescript
// Encode filter state
const encoded = encodeObjectToUrl({ filters: { tags: ['tools'] }, sort: 'date' });
const url = `/sales?state=${encoded}`;

// Decode
const state = decodeUrlToObject(params.get('state'));
if (state) applyFilters(state.filters);
```

### `getPaginationFromQuery(queryString, defaultPageSize?)`
Extract pagination info from URL.
```typescript
const { page, limit, offset } = getPaginationFromQuery(location.search, 20);
// Use in API call: /api/sales?offset=40&limit=20
```

---

## Date & Time Utilities

Located in: `packages/shared/src/datetime.ts`

### Yellowknife Timezone Functions

```typescript
// Get current time in Yellowknife
const ykTime = getYellowknifeTime();

// Format date for Yellowknife timezone
formatYellowknifeDate(new Date(), 'long');
// "Monday, January 15, 2025"

// Format time for Yellowknife timezone
formatYellowknifeTime(new Date(), '12hr'); // "2:30 PM"
formatYellowknifeTime(new Date(), '24hr'); // "14:30"
```

### Time Slot Management

```typescript
// Calculate duration between times
const duration = calculateDuration('09:00', '17:30'); // 510 minutes

// Add minutes to time
addMinutesToTime('09:00', 90); // "10:30"

// Check for time slot overlaps
const overlap = doTimeSlotsOverlap(
  { start: '09:00', end: '12:00' },
  { start: '11:00', end: '14:00' }
); // true

// Generate time slots
const slots = generateTimeSlots('09:00', '17:00', 60, 30);
// 30-minute slots every hour

// Find available slots
const available = findAvailableSlots(
  '2025-01-15',
  { open: '09:00', close: '17:00' },
  [{ start: '10:00', end: '11:00' }],
  60
);
```

### Yellowknife-Specific Functions

```typescript
// Calculate daylight hours for Yellowknife
getDaylightHours(new Date('2025-06-21')); // ~20.5 hours (summer)
getDaylightHours(new Date('2025-12-21')); // ~4.5 hours (winter)

// Check if aurora season (Aug-Apr)
isAuroraSeason(new Date('2025-01-15')); // true
isAuroraSeason(new Date('2025-07-15')); // false (too much daylight)
```

### Date Helpers

```typescript
// Get week number
getWeekNumber(new Date('2025-01-15')); // 3

// Get day of year
getDayOfYear(new Date('2025-01-15')); // 15

// Check same day
isSameDay(new Date('2025-01-15T10:00'), new Date('2025-01-15T16:00')); // true

// Relative date description
getRelativeDateDescription(new Date()); // "Today"
getRelativeDateDescription(tomorrow); // "Tomorrow"
```

### Business Hours

```typescript
const isOpen = isBusinessHours(new Date(), {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  saturday: null, // Closed
  sunday: null    // Closed
});
```

---

## React Hooks (Web App)

Located in: `apps/web/src/hooks/`

### `useDebounce<T>(value, delay)`
Debounce any value.
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchGarageSales(debouncedSearch);
  }
}, [debouncedSearch]);
```

### `useAsyncState<T, Args>(asyncFunction)`
Manage async state (loading, error, data).
```typescript
const { data, loading, error, execute, reset } = useAsyncState(
  async (id: string) => fetchGarageSale(id)
);

// Later:
await execute(saleId);
if (data) console.log(data);
```

### `useForm<T>(config)`
Comprehensive form management.
```typescript
const form = useForm({
  initialValues: { email: '', password: '' },
  validationSchema: {
    email: FieldValidators.email(),
    password: FieldValidators.password()
  },
  onSubmit: async (values) => {
    await login(values);
  }
});

return (
  <form onSubmit={form.handleSubmit}>
    <input {...form.getFieldProps('email')} />
    {form.getFieldError('email') && (
      <span className="error">{form.getFieldError('email')}</span>
    )}
    <button disabled={form.isSubmitting || !form.isValid}>
      Login
    </button>
  </form>
);
```

---

## Existing Utilities

### Storage (Web App)
`apps/web/src/lib/storage.ts` - LocalStorage with TTL support

```typescript
// Set with expiration
setLocalStorage('cache', data, 30); // 30 minutes

// Get with automatic expiration check
const data = getLocalStorage<UserData>('user-data');

// Clear by prefix
clearLocalStorageByPrefix('yk-buddy-cache-');

// Update partial
updateLocalStorage('preferences', { theme: 'dark' });
```

### Validation (Web App)
`apps/web/src/lib/validation.ts`

```typescript
isValidEmail(email)
isValidPhoneNumber(phone)
isValidPostalCode(postalCode)
isValidCoordinates(lat, lng)
validatePassword(password)
validateGarageSaleDate(dateString)
validateTimeRange(startTime, endTime)
isValidImageFile(filename)
validateFileSize(bytes, maxMB)
```

### Utils (Web App)
`apps/web/src/lib/utils.ts`

```typescript
formatDate(date, locale)
formatTime(timeString)
formatRelativeTime(date)
formatDuration(minutes)
formatCurrency(amount, currency, locale)
calculateDistance(lat1, lon1, lat2, lon2)
truncateText(text, maxLength)
debounce(func, wait)
groupBy(array, key)
cn(...classes) // Conditional class names
```

### API Helpers (Web App)
`apps/web/src/lib/api-helpers.ts`

```typescript
// HTTP methods
await apiGet<T>(url, options)
await apiPost<T>(url, data, options)
await apiPut<T>(url, data, options)
await apiPatch<T>(url, data, options)
await apiDelete<T>(url, options)

// Helpers
buildQueryString(params)
handleApiError(error)
isSuccessResponse(response)
uploadFile(url, file, onProgress)
createPaginatedFetcher(baseUrl, limit)
```

### Arrays (Web App)
`apps/web/src/lib/arrays.ts`

```typescript
sortByProperty(array, key, order)
sortByMultiple(array, sortConfig)
uniqueBy(array, key)
chunk(array, size)
shuffle(array)
getRandomItems(array, count)
difference(array1, array2, key?)
intersection(array1, array2, key?)
partition(array, predicate)
countOccurrences(array, key?)
mostCommon(array, key?)
average(array, key)
sum(array, key)
paginate(array, page, pageSize)
filterBySearch(array, searchTerms, keys)
```

### Type Guards (Web App)
`apps/web/src/lib/type-guards.ts`

```typescript
isNonEmptyString(value)
isValidNumber(value)
isValidDate(value)
isNonEmptyArray(value)
isStringArray(value)
isPlainObject(value)
hasProperty(obj, key)
isEmail(value)
isUrl(value)
isISODate(value)
isCoordinates(value)
isValidKPIndex(value)
assertDefined(value, message) // Throws if not defined
```

---

## Usage Examples

### Complete Form Example

```typescript
import { useForm } from '@/hooks/useForm';
import { FieldValidators } from '@yk-trip-planner/shared/forms';

function CreateGarageSaleForm() {
  const form = useForm({
    initialValues: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      tags: [],
    },
    validationSchema: {
      title: FieldValidators.requiredText('Title', 3, 100),
      date: FieldValidators.futureDate('Sale Date'),
      startTime: { required: true, label: 'Start Time' },
      endTime: {
        required: true,
        label: 'End Time',
        custom: (value) => {
          const { startTime } = form.values;
          return validateTimeRange(startTime, value).valid
            ? null
            : 'End time must be after start time';
        }
      },
    },
    onSubmit: async (values) => {
      await createGarageSale(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps('title')} />
      {form.getFieldError('title') && <span>{form.getFieldError('title')}</span>}

      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        Create Sale
      </button>
    </form>
  );
}
```

### Async Data Fetching

```typescript
import { useAsyncState } from '@/hooks/useAsyncState';
import { retryWithBackoff } from '@yk-trip-planner/shared/async';

function GarageSalesList() {
  const { data, loading, error, execute } = useAsyncState(async () => {
    return retryWithBackoff(
      () => fetch('/api/garage-sales').then(r => r.json()),
      { maxRetries: 3 }
    );
  });

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <div>{data?.map(sale => <SaleCard key={sale.id} sale={sale} />)}</div>;
}
```

### Search with Debounce

```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

function SearchGarageSales() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedSearch) {
      searchGarageSales(debouncedSearch).then(setResults);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search sales..."
    />
  );
}
```

---

## Best Practices

1. **Use type-safe utilities**: Always provide type parameters where available
2. **Validate early**: Use form validators and type guards at boundaries
3. **Handle errors**: Use `safeAsync` for operations that might fail
4. **Cache wisely**: Use `asyncCache` for expensive operations
5. **Debounce user input**: Use `useDebounce` or `debounceAsync` for search
6. **Control concurrency**: Use `asyncPool` to avoid overwhelming APIs
7. **Prefer existing utilities**: Check this guide before writing custom code

---

## Contributing

When adding new utilities:

1. Place shared utilities in `packages/shared/src/`
2. Place web-specific utilities in `apps/web/src/lib/`
3. Add comprehensive JSDoc comments
4. Include usage examples
5. Update this guide
6. Add TypeScript types
7. Consider edge cases and error handling
