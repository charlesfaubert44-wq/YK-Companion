# YK Buddy - Quick Reference Guide

## 🚀 Getting Started

```bash
# Install everything
npm install
cd apps/web && npm install

# Setup git hooks
npm run prepare

# Run tests
cd apps/web && npm test

# Start development
npm run dev:web
```

---

## 📁 Important Files

### New Production Infrastructure

```
YK-Companion-1/
├── 📊 Testing
│   ├── apps/web/jest.config.js          # Jest configuration
│   ├── apps/web/jest.setup.js           # Test setup
│   └── apps/web/src/**/__tests__/       # All tests here
│
├── 🔒 Security
│   ├── apps/web/src/middleware.ts       # Security headers
│   ├── apps/web/src/lib/validation.ts   # Input validation
│   └── apps/web/src/lib/rate-limiter.ts # Rate limiting
│
├── 🐛 Error Handling
│   ├── apps/web/src/lib/logger.ts           # Logging utility
│   ├── apps/web/src/components/ErrorBoundary.tsx
│   ├── apps/web/src/app/error.tsx           # Error page
│   └── apps/web/src/app/global-error.tsx    # Global errors
│
├── ⚡ Performance
│   ├── apps/web/src/lib/cache.ts         # Caching system
│   ├── apps/web/src/lib/performance.ts   # Performance utils
│   └── apps/web/next.config.js           # Optimizations
│
├── 🔧 Code Quality
│   ├── apps/web/.eslintrc.json          # ESLint config
│   ├── .prettierrc.json                 # Prettier config
│   ├── .husky/                          # Git hooks
│   └── .lintstagedrc.json               # Lint-staged config
│
├── 🤖 CI/CD
│   └── .github/workflows/
│       ├── ci.yml                       # Main CI pipeline
│       ├── deploy-preview.yml           # PR previews
│       └── dependency-update.yml        # Dependency updates
│
├── 📈 Monitoring
│   ├── apps/web/src/app/api/health/route.ts  # Health check
│   └── apps/web/src/app/api/metrics/route.ts # Metrics
│
└── 📚 Documentation
    ├── EXECUTIVE_SUMMARY.md             # Start here! ⭐
    ├── IMPLEMENTATION_GUIDE.md          # Setup guide
    ├── IMPROVEMENTS_SUMMARY.md          # Detailed improvements
    ├── API_DOCUMENTATION.md             # API reference
    ├── DATABASE_BACKUP_STRATEGY.md      # Backup guide
    ├── ENV_SETUP_GUIDE.md               # Environment setup
    └── QUICK_REFERENCE.md               # This file
```

---

## 🎯 Common Commands

### Development
```bash
npm run dev:web              # Start web app
npm test                     # Run all tests
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage report
npm run lint                 # Check linting
npm run lint:fix             # Auto-fix issues
npm run type-check           # TypeScript check
npm run validate             # All checks
```

### Production
```bash
npm run build:web            # Build for production
npm run start:web            # Start production server
```

### Formatting
```bash
npm run format               # Format all files
npm run format:check         # Check formatting
```

### Cleanup
```bash
npm run clean                # Remove all node_modules and build files
```

---

## 📝 Code Examples

### Logging
```typescript
import { logDebug, logError, logWarn, logInfo } from '@/lib/logger';

logDebug('Debug message', { context });
logInfo('Info message');
logWarn('Warning message', { data });
logError('Error occurred', error, { userId });
```

### Error Handling
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Input Validation
```typescript
import { emailSchema, garageSaleSchema } from '@/lib/validation';

const email = emailSchema.parse(userInput);
const sale = garageSaleSchema.parse(formData);
```

### Rate Limiting
```typescript
import { rateLimiter, RATE_LIMITS } from '@/lib/rate-limiter';

if (!rateLimiter.check('login', RATE_LIMITS.login)) {
  throw new Error('Rate limited');
}
```

### Caching
```typescript
import { cache, CACHE_TTL } from '@/lib/cache';

const data = await cache.getOrFetch(
  'key',
  () => fetchData(),
  CACHE_TTL.MEDIUM
);
```

### Performance
```typescript
import { debounce, measureRender } from '@/lib/performance';

const debouncedSearch = debounce(search, 300);
const render = measureRender('ComponentName');
```

---

## 🧪 Testing

### Run Tests
```bash
npm test                     # All tests
npm test -- ComponentName    # Specific test
npm test -- --watch          # Watch mode
npm test -- --coverage       # Coverage
npm test -- -u               # Update snapshots
```

### Write Tests
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

---

## 🔐 Security Checklist

- [x] Security headers configured
- [x] Input validation on all forms
- [x] Rate limiting implemented
- [x] XSS prevention
- [x] SQL injection prevention (Supabase)
- [x] HTTPS only (production)
- [x] Environment variables secured
- [x] Dependencies updated

---

## 📊 Health Checks

### Check Application Health
```bash
curl https://ykbuddy.com/api/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-10-28T12:00:00Z",
  "uptime": 3600,
  "checks": {
    "server": "ok",
    "database": "ok"
  }
}
```

### Get Metrics
```bash
curl https://ykbuddy.com/api/metrics
```

---

## 🗄️ Database

### Backup
```bash
cd supabase
supabase db dump > backup.sql
gzip backup.sql
```

### Restore
```bash
psql [DATABASE_URL] < backup.sql
```

See `DATABASE_BACKUP_STRATEGY.md` for details.

---

## 🚨 Troubleshooting

### Tests Not Running
```bash
npm test -- --clearCache
rm -rf node_modules
npm install
```

### Linting Errors
```bash
npm run lint:fix
```

### Husky Hooks Not Working
```bash
rm -rf .husky
npm run prepare
chmod +x .husky/*
```

### Type Errors
```bash
rm -rf .next
npm run type-check
```

---

## 📚 Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `EXECUTIVE_SUMMARY.md` | Overview of all improvements | **Start here** |
| `IMPLEMENTATION_GUIDE.md` | Step-by-step setup | Setting up |
| `IMPROVEMENTS_SUMMARY.md` | Detailed technical changes | Deep dive |
| `API_DOCUMENTATION.md` | API reference | Building features |
| `DATABASE_BACKUP_STRATEGY.md` | Backup procedures | Production setup |
| `ENV_SETUP_GUIDE.md` | Environment config | Initial setup |
| `QUICK_REFERENCE.md` | Quick commands | Daily use |

---

## 🎯 Next Steps

### Today
1. Read `EXECUTIVE_SUMMARY.md`
2. Run `npm install`
3. Run `npm test`
4. Review test results

### This Week
1. Follow `IMPLEMENTATION_GUIDE.md`
2. Setup environment variables
3. Fix any linting issues
4. Deploy to staging

### This Month
1. Integrate error monitoring
2. Setup analytics
3. Configure backups
4. Deploy to production

---

## 💡 Pro Tips

### Development
- Use `npm run validate` before pushing
- Run tests in watch mode while developing
- Check coverage to find untested code

### Git Workflow
- Pre-commit hooks will auto-format and lint
- Pre-push hooks will run tests
- Don't skip hooks (they save you time)

### Performance
- Use caching for expensive operations
- Debounce user inputs
- Monitor Web Vitals

### Security
- Always validate user input
- Use rate limiting for sensitive operations
- Check security headers regularly

---

## 🔗 Links

- **Production**: https://ykbuddy.com (pending)
- **Staging**: https://staging.ykbuddy.com (setup)
- **GitHub**: Your repository
- **CI/CD**: GitHub Actions tab
- **Monitoring**: Setup with Sentry/Uptime Robot

---

## 📞 Support

- **Documentation**: This folder
- **Issues**: GitHub Issues
- **Email**: support@ykbuddy.com

---

**Quick Start**: `npm install && npm run prepare && npm test` ✅

**Last Updated**: October 2025


