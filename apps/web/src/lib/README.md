# YK Buddy Utility Functions

This directory contains production-ready utility functions for the YK Buddy application. All functions are fully typed, documented with JSDoc comments, and include usage examples.

## Table of Contents

1. [Storage Utilities](#storage-utilities) - `storage.ts`
2. [Aurora & Weather Utilities](#aurora--weather-utilities) - `aurora.ts`
3. [Array Utilities](#array-utilities) - `arrays.ts`
4. [URL & Navigation Utilities](#url--navigation-utilities) - `urls.ts`
5. [Color & Theme Utilities](#color--theme-utilities) - `colors.ts`
6. [Type Guards](#type-guards) - `type-guards.ts`
7. [React Hooks](#react-hooks) - `../hooks/`

---

## Storage Utilities

**File:** `storage.ts`

Type-safe localStorage operations with expiration support and cross-tab synchronization.

### Key Functions

- `setLocalStorage<T>(key, value, ttlMinutes?)` - Store value with optional expiration
- `getLocalStorage<T>(key)` - Retrieve value with automatic expiry check
- `removeLocalStorage(key)` - Remove specific item
- `clearLocalStorageByPrefix(prefix)` - Clear all items with prefix
- `updateLocalStorage<T>(key, updates)` - Update specific properties
- `isLocalStorageAvailable()` - Check if localStorage is available

### Usage Example

```typescript
import { setLocalStorage, getLocalStorage, STORAGE_KEYS } from '@/lib/storage';

// Store with 60-minute expiration
setLocalStorage(STORAGE_KEYS.GARAGE_SALES_CACHE, salesData, 60);

// Retrieve (returns null if expired)
const cached = getLocalStorage<GarageSale[]>(STORAGE_KEYS.GARAGE_SALES_CACHE);
```

---

## Aurora & Weather Utilities

**File:** `aurora.ts`

Yellowknife-specific utilities for aurora forecasting, seasonal data, and northern climate information.

### Key Functions

- `getAuroraQuality(kpIndex)` - Convert KP index to quality rating
- `getAuroraDescription(kpIndex)` - Human-readable aurora conditions
- `isGoodAuroraViewingTime(kpIndex, hour)` - Check if conditions are favorable
- `getCurrentSeason(date?)` - Get Yellowknife season
- `getSeasonalTemperature(season)` - Get typical temp ranges
- `getDaylightHours(season)` - Get daylight duration
- `isAuroraSeason(date?)` - Check if it's prime aurora season (Sep-Apr)
- `getAuroraColors(kpIndex)` - Get color palette for visualization
- `getRecommendedClothing(tempCelsius)` - Get clothing recommendations

### Usage Example

```typescript
import { getAuroraQuality, getAuroraDescription, isAuroraSeason } from '@/lib/aurora';

const kpIndex = 5;
const quality = getAuroraQuality(kpIndex); // 'excellent'
const description = getAuroraDescription(kpIndex); // Detailed description

if (isAuroraSeason()) {
  // Show aurora viewing features
}
```

---

## Array Utilities

**File:** `arrays.ts`

Comprehensive array manipulation utilities for sorting, filtering, grouping, and pagination.

### Key Functions

- `sortByProperty<T>(array, key, order)` - Sort by single property
- `sortByMultiple<T>(array, sortConfig)` - Sort by multiple properties
- `uniqueBy<T>(array, key)` - Remove duplicates by property
- `chunk<T>(array, size)` - Split into smaller arrays
- `shuffle<T>(array)` - Random shuffle
- `getRandomItems<T>(array, count)` - Get random samples
- `partition<T>(array, predicate)` - Split into two arrays
- `countOccurrences<T>(array, key?)` - Count value frequencies
- `average<T>(array, key)` - Calculate numeric average
- `paginate<T>(array, page, pageSize)` - Pagination helper
- `filterBySearch<T>(array, terms, keys)` - Multi-field search

### Usage Example

```typescript
import { sortByProperty, paginate, filterBySearch } from '@/lib/arrays';

// Sort garage sales by date
const sorted = sortByProperty(sales, 'sale_date', 'asc');

// Search across multiple fields
const results = filterBySearch(sales, ['furniture', 'tools'], ['title', 'description', 'items_description']);

// Paginate results
const page = paginate(results, 0, 10);
// { items: [...], page: 0, totalPages: 5, hasNextPage: true, ... }
```

---

## URL & Navigation Utilities

**File:** `urls.ts`

URL builders for maps, social sharing, external services, and internal routing.

### Key Functions

- `getDirectionsUrl(lat, lng, origin?)` - Google Maps directions
- `getMapSearchUrl(address)` - Google Maps search
- `getSocialShareUrl(platform, url, text?)` - Social media sharing
- `getPhoneUrl(phoneNumber)` - tel: URL
- `getEmailUrl(email, subject?, body?)` - mailto: URL
- `getWeatherUrl(source?)` - Yellowknife weather forecast
- `getAuroraForecastUrl(source?)` - Aurora forecast URL
- `buildRoute(path, params?)` - Internal route with query params
- `getShareableUrl(path, utmParams?)` - URL with UTM tracking
- `getCalendarEventUrl(event)` - Google Calendar add event
- `isExternalUrl(url)` - Check if URL is external

### Usage Example

```typescript
import { getDirectionsUrl, getSocialShareUrl, getCalendarEventUrl } from '@/lib/urls';

// Generate directions to garage sale
const directionsUrl = getDirectionsUrl(sale.latitude, sale.longitude);

// Share on social media
const facebookUrl = getSocialShareUrl('facebook', window.location.href, 'Check out this garage sale!');

// Add to calendar
const calendarUrl = getCalendarEventUrl({
  title: sale.title,
  start: `${sale.sale_date}T${sale.start_time}:00`,
  end: `${sale.sale_date}T${sale.end_time}:00`,
  location: sale.address,
});
```

---

## Color & Theme Utilities

**File:** `colors.ts`

Color manipulation, aurora theme generation, and WCAG accessibility checks.

### Key Functions

- `hexToRgb(hex)` - Convert hex to RGB
- `rgbToHex(r, g, b)` - Convert RGB to hex
- `hexToHsl(hex)` - Convert hex to HSL
- `lightenColor(hex, percent)` - Lighten color
- `darkenColor(hex, percent)` - Darken color
- `addOpacity(hex, opacity)` - Add alpha channel
- `generateGradient(color1, color2, direction)` - CSS gradient
- `generateAuroraGradient(kpIndex)` - Aurora-themed gradient
- `getContrastRatio(hex1, hex2)` - WCAG contrast ratio
- `meetsWCAGAA(textColor, bgColor, largeText?)` - Accessibility check
- `getAuroraColor(name, shade)` - Get brand color
- `getRandomAuroraColor()` - Random aurora color

### Constants

- `AURORA_COLORS` - Brand color palette
- `NORTHERN_COLORS` - Theme colors (midnight, gold, ice, snow)

### Usage Example

```typescript
import { generateAuroraGradient, meetsWCAGAA, AURORA_COLORS } from '@/lib/colors';

// Generate gradient based on KP index
const gradient = generateAuroraGradient(5); // Green-blue-purple gradient

// Check accessibility
const isAccessible = meetsWCAGAA('#10B981', '#0A1128', false); // true

// Use brand colors
const primaryGreen = AURORA_COLORS.green.primary; // '#10B981'
```

---

## Type Guards

**File:** `type-guards.ts`

Runtime type checking and TypeScript type guards for safer code.

### Key Functions

- `isUserType(value)` - Check if valid UserType
- `isNonEmptyString(value)` - Non-empty string check
- `isValidNumber(value)` - Valid number (not NaN/Infinity)
- `isValidDate(value)` - Valid Date object
- `isNonEmptyArray<T>(value)` - Non-empty array
- `isStringArray(value)` - Array of strings
- `isPlainObject(value)` - Plain object check
- `hasProperty<K>(obj, key)` - Property existence
- `isDefined<T>(value)` - Not null/undefined
- `isEmail(value)` - Valid email format
- `isUrl(value)` - Valid URL
- `isISODate(value)` - ISO date string (YYYY-MM-DD)
- `isCoordinates(value)` - Valid lat/lng object
- `isValidKPIndex(value)` - Valid KP index (0-9)
- `assertDefined<T>(value, message?)` - Throw if undefined
- `assertNonEmptyString(value, message?)` - Throw if empty

### Usage Example

```typescript
import { isNonEmptyString, isCoordinates, isDefined } from '@/lib/type-guards';

// Type-safe filtering
const validSales = sales.filter(sale => isDefined(sale.sale_date));

// Runtime validation
if (isCoordinates(location)) {
  // TypeScript knows location has latitude and longitude
  const { latitude, longitude } = location;
}

// Assertions
function processUser(userId: string | undefined) {
  assertDefined(userId, 'User ID is required');
  // TypeScript now knows userId is string
  return userId.toUpperCase();
}
```

---

## React Hooks

**Location:** `../hooks/`

Custom React hooks for common patterns.

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage';

function MyComponent() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');

  return (
    <button onClick={() => setTheme('light')}>
      Switch to Light Mode
    </button>
  );
}
```

### useDebounce

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    // Only runs 500ms after user stops typing
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### useMediaQuery

```typescript
import { useIsMobile, useIsDesktop, usePrefersDarkMode } from '@/hooks/useMediaQuery';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const prefersDark = usePrefersDarkMode();

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useOnScreen

```typescript
import { useOnScreen, useOnScreenOnce } from '@/hooks/useOnScreen';

function LazyComponent() {
  const [ref, isVisible] = useOnScreen({ threshold: 0.5 });

  return (
    <div ref={ref}>
      {isVisible ? <ExpensiveComponent /> : <Placeholder />}
    </div>
  );
}

function AnimatedComponent() {
  const [ref, wasVisible] = useOnScreenOnce();

  return (
    <div ref={ref} className={wasVisible ? 'animate-fade-in' : 'opacity-0'}>
      Animates once when scrolled into view
    </div>
  );
}
```

---

## Best Practices

### Importing

```typescript
// Import specific functions
import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import { sortByProperty, paginate } from '@/lib/arrays';

// Import all from a module (less common)
import * as storageUtils from '@/lib/storage';
```

### Error Handling

All utility functions include built-in error handling and return sensible defaults:

```typescript
// Returns null if error or expired
const cached = getLocalStorage('key');

// Returns empty array if error
const items = getLocalStorageByPrefix('prefix');

// Returns original value if invalid
const lightened = lightenColor(invalidHex, 20);
```

### TypeScript Usage

Take advantage of generic types:

```typescript
// Type-safe storage
const sales = getLocalStorage<GarageSale[]>('sales');

// Type-safe sorting
const sorted = sortByProperty(sales, 'sale_date', 'asc');

// Type-safe filtering
const defined = items.filter(isDefined);
```

### Performance

- Use `useDebounce` for expensive operations triggered by user input
- Use `useOnScreen` for lazy loading heavy components
- Use localStorage caching with TTL for API responses
- Use `paginate` for large lists instead of rendering all items

---

## Contributing

When adding new utilities:

1. Add comprehensive JSDoc comments with parameter descriptions and examples
2. Include TypeScript types for all parameters and return values
3. Handle edge cases and errors gracefully
4. Add usage examples in this README
5. Consider SSR compatibility (check for `window` availability)
6. Write utility functions as pure functions when possible

---

## Need Help?

All functions include JSDoc comments with:
- Description of what the function does
- Parameter explanations
- Return value descriptions
- Usage examples
- Edge case notes

Use your IDE's autocomplete and hover tooltips to see documentation inline.
