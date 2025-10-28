# Implementation Guide - Getting Started with Improvements

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Web app dependencies
cd apps/web
npm install
```

### 2. Setup Git Hooks

```bash
# From project root
npm run prepare

# This installs Husky hooks
```

### 3. Verify Setup

```bash
cd apps/web

# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# All checks
npm run validate
```

---

## Detailed Implementation

### Step 1: Environment Variables

Create `apps/web/.env.local`:

```bash
# Copy from ENV_SETUP_GUIDE.md
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-token
```

### Step 2: Run Tests

```bash
cd apps/web

# Run all tests
npm test

# Watch mode (for development)
npm run test:watch

# Coverage report
npm run test:coverage
```

**Expected output:**
```
PASS  src/components/__tests__/LanguageSelector.test.tsx
PASS  src/lib/__tests__/supabase.test.ts

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Coverage:    70%
```

### Step 3: Fix Linting Issues

```bash
# Check for issues
npm run lint

# Auto-fix
npm run lint:fix
```

### Step 4: Format Code

```bash
# From project root
npm run format

# Check formatting
npm run format:check
```

### Step 5: Enable Pre-commit Hooks

Hooks are automatically enabled after `npm run prepare`.

**Test the hooks:**
```bash
# Make a change
echo "// test" >> src/test.ts

# Try to commit
git add .
git commit -m "test"

# Should run:
# - lint-staged (format + lint)
# - type-check
```

### Step 6: Verify CI/CD

Push to GitHub and check Actions tab:
- ✅ Lint & Type Check
- ✅ Unit Tests
- ✅ Build Check
- ✅ Security Audit

---

## Using New Features

### Logging

**Before:**
```typescript
console.log('User logged in', user);
console.error('Error fetching data', error);
```

**After:**
```typescript
import { logDebug, logError } from '@/lib/logger';

logDebug('User logged in', { userId: user.id });
logError('Error fetching data', error, { endpoint });
```

---

### Error Handling

**Wrap components:**
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Wrap async functions:**
```typescript
import { withErrorHandler } from '@/components/ErrorBoundary';

const fetchData = withErrorHandler(
  async () => {
    const response = await fetch('/api/data');
    return response.json();
  },
  'Failed to fetch data'
);
```

---

### Input Validation

```typescript
import { emailSchema, garageSaleSchema } from '@/lib/validation';

// Validate email
const email = emailSchema.parse(input); // Throws if invalid

// Validate form data
const formData = garageSaleSchema.parse(data);
```

---

### Rate Limiting

```typescript
import { rateLimiter, RATE_LIMITS } from '@/lib/rate-limiter';

async function handleLogin(email: string) {
  // Check rate limit
  if (!rateLimiter.check(`login:${email}`, RATE_LIMITS.login)) {
    throw new Error('Too many login attempts. Try again later.');
  }
  
  // Proceed with login
  await signIn(email);
}
```

---

### Caching

```typescript
import { cache, CACHE_TTL } from '@/lib/cache';

// Get or fetch data
const sales = await cache.getOrFetch(
  'garage-sales',
  async () => {
    const { data } = await supabase.from('garage_sales').select('*');
    return data;
  },
  CACHE_TTL.MEDIUM // 5 minutes
);

// Manual cache management
cache.set('key', data, CACHE_TTL.LONG);
const cached = cache.get('key');
cache.delete('key');
```

---

### Performance Monitoring

```typescript
import { measureRender, debounce } from '@/lib/performance';

function MyComponent() {
  const render = measureRender('MyComponent');
  
  useEffect(() => {
    render.start();
    return () => render.end();
  });
  
  // Debounce search
  const handleSearch = debounce((query: string) => {
    performSearch(query);
  }, 300);
  
  return <div>...</div>;
}
```

---

## Testing Guide

### Writing Tests

**Component test:**
```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Utility test:**
```typescript
// src/lib/__tests__/myUtil.test.ts
import { myFunction } from '@/lib/myUtil';

describe('myFunction', () => {
  it('returns correct value', () => {
    expect(myFunction(5)).toBe(10);
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm test MyComponent

# Update snapshots
npm test -- -u
```

---

## CI/CD Guide

### GitHub Actions

**Automatic triggers:**
- Every push to main/master/develop
- Every pull request
- Weekly dependency updates

**Manual trigger:**
```bash
# From GitHub UI:
Actions → CI → Run workflow
```

### Deployment

**Vercel (Recommended):**
1. Connect GitHub repo
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Preview deployments:**
- Automatic for every PR
- Check Vercel bot comment for URL

---

## Monitoring Setup

### Health Checks

**Setup Uptime Robot:**
1. Create monitor: HTTP(s)
2. URL: `https://ykbuddy.com/api/health`
3. Interval: 5 minutes
4. Alert email: your@email.com

**Verify health:**
```bash
curl https://ykbuddy.com/api/health
```

### Metrics

```bash
curl https://ykbuddy.com/api/metrics
```

---

## Database Backups

### Automated (Supabase)
- Daily automatic backups
- 7-day retention (free tier)
- No setup required

### Manual Backups

```bash
# Weekly backup (run Sundays 2 AM)
cd supabase
supabase db dump > backups/backup_$(date +%Y%m%d).sql

# Compress
gzip backups/backup_*.sql
```

### Restore

```bash
# Restore from backup
psql [DATABASE_URL] < backup.sql
```

See `DATABASE_BACKUP_STRATEGY.md` for details.

---

## Troubleshooting

### Tests Failing

```bash
# Clear cache
npm test -- --clearCache

# Update snapshots
npm test -- -u

# Verbose output
npm test -- --verbose
```

### Linting Errors

```bash
# Auto-fix
npm run lint:fix

# Check specific file
npx eslint src/path/to/file.tsx --fix
```

### Husky Hooks Not Running

```bash
# Reinstall
rm -rf .husky
npm run prepare

# Check permissions (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Type Errors

```bash
# Rebuild types
cd apps/web
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## Best Practices

### 1. Always Write Tests
```typescript
// When adding a feature, add tests
// src/components/NewFeature.tsx
// src/components/__tests__/NewFeature.test.tsx
```

### 2. Use Logging Instead of console.log
```typescript
// ❌ Don't
console.log('Data:', data);

// ✅ Do
logDebug('Data fetched', { data });
```

### 3. Validate All User Input
```typescript
// ❌ Don't
const email = formData.get('email');

// ✅ Do
const email = emailSchema.parse(formData.get('email'));
```

### 4. Cache Expensive Operations
```typescript
// ❌ Don't
const data = await fetchExpensiveData();

// ✅ Do
const data = await cache.getOrFetch('key', fetchExpensiveData, CACHE_TTL.MEDIUM);
```

### 5. Handle Errors Gracefully
```typescript
// ❌ Don't
const data = await fetch('/api/data').then(r => r.json());

// ✅ Do
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Fetch failed');
  const data = await response.json();
  return data;
} catch (error) {
  logError('Failed to fetch data', error);
  throw error;
}
```

---

## Performance Tips

### 1. Use Next.js Image Component
```typescript
// ❌ Don't
<img src="/image.jpg" alt="..." />

// ✅ Do
import Image from 'next/image';
<Image src="/image.jpg" alt="..." width={500} height={300} />
```

### 2. Lazy Load Components
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### 3. Debounce User Input
```typescript
import { debounce } from '@/lib/performance';

const debouncedSearch = debounce(handleSearch, 300);
```

---

## Security Checklist

- [x] Input validation on all forms
- [x] Rate limiting on sensitive operations
- [x] Security headers configured
- [x] HTTPS only in production
- [x] Environment variables never committed
- [x] Dependencies regularly updated
- [x] SQL injection prevention (using Supabase)
- [x] XSS prevention (sanitization)

---

## Next Steps

1. ✅ Complete implementation (you are here)
2. 🔄 Install dependencies
3. 🔄 Run tests and fix any issues
4. 🔄 Deploy to staging
5. 🔄 Setup monitoring
6. 🔄 Configure backups
7. 🚀 Deploy to production

---

## Support

**Questions?**
- Check documentation: `IMPROVEMENTS_SUMMARY.md`
- Review examples in test files
- Open GitHub issue

**Need Help?**
- Email: support@ykbuddy.com
- Slack: #dev-help (if applicable)

---

**Last Updated**: October 2025  
**Status**: Ready for Implementation 🚀


