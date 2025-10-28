# ADR-0010: Pragmatic Testing Approach

**Status:** Accepted
**Date:** 2025-01-20
**Decision Makers:** Development Team
**Impact:** Medium

---

## Context

We need a testing strategy that balances:

- **Quality** - Catch bugs before production
- **Speed** - Fast development iterations
- **Maintenance** - Tests don't slow us down
- **Coverage** - Test critical paths
- **Pragmatism** - Test where it matters most

### Constraints

- Small team (1-2 developers)
- Limited time (~3-4 months to MVP)
- Need to ship features quickly
- Budget for manual testing minimal
- Can't write tests for everything

### Testing Philosophy

**"Test where it adds value, skip where it doesn't"**

---

## Decision

**We will adopt a pragmatic, value-focused testing strategy:**

1. **Unit Tests** - For complex business logic and utilities
2. **Integration Tests** - For critical API routes
3. **Manual Testing** - For UI and user flows
4. **No E2E Tests** - Too slow for MVP
5. **Vitest** - Fast, modern test runner

### What We Test

✅ **High Value:**
- Utility functions (date formatting, validation)
- Business logic (route optimization, pricing calculations)
- Critical API routes (auth, payments)
- Data transformations

❌ **Low Value:**
- UI components (too brittle)
- Next.js pages (manual testing faster)
- Simple CRUD operations
- Straightforward database queries

---

## Alternatives Considered

### Alternative 1: High Test Coverage (80%+)

**Pros:** Comprehensive safety net, refactor confidently
**Cons:** Slow development, expensive maintenance, diminishing returns
**Why not chosen:** Too slow for MVP stage

### Alternative 2: TDD (Test-Driven Development)

**Pros:** Tests first, good design, high coverage
**Cons:** Slower initial development, learning curve
**Why not chosen:** Team not experienced with TDD, too slow for MVP

### Alternative 3: E2E Only (Playwright/Cypress)

**Pros:** Test real user flows, catch integration bugs
**Cons:** Slow, flaky, expensive to maintain
**Why not chosen:** Too slow for small team

### Alternative 4: No Tests

**Pros:** Fastest development
**Cons:** No safety net, bugs in production
**Why not chosen:** Some tests better than none

---

## Consequences

### Positive Consequences

- **Fast Development** - Only test what matters
- **Low Maintenance** - Fewer tests to maintain
- **Quick Feedback** - Tests run fast (< 10s)
- **Pragmatic** - Test coverage where it adds value
- **Easy to Run** - `npm test` just works

### Negative Consequences

- **Lower Coverage** - Won't catch all bugs
- **Manual Testing** - Must manually test UI changes
- **UI Bugs** - UI regressions possible
- **Refactoring Risk** - Less safety net for refactoring

---

## Implementation

### Test Setup (Vitest)

```json
// packages/shared/package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest": "latest",
    "@vitest/ui": "latest",
    "@vitest/coverage-v8": "latest",
    "happy-dom": "latest"
  }
}
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.test.ts', '**/node_modules/**'],
    },
  },
});
```

### Example Tests

**Utility Function Test:**
```typescript
// packages/shared/src/datetime.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, isValidDate } from './datetime';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-27');
    expect(formatDate(date)).toBe('January 27, 2025');
  });

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('isValidDate', () => {
  it('validates correct date', () => {
    expect(isValidDate('2025-01-27')).toBe(true);
  });

  it('rejects invalid date', () => {
    expect(isValidDate('invalid')).toBe(false);
  });
});
```

**Business Logic Test:**
```typescript
// packages/shared/src/pricing.test.ts
import { calculateSpotlightPrice } from './pricing';

describe('calculateSpotlightPrice', () => {
  it('calculates base price correctly', () => {
    expect(calculateSpotlightPrice(1, 1)).toBe(50);
  });

  it('applies volume discount', () => {
    expect(calculateSpotlightPrice(1, 3)).toBe(135); // 10% off
  });

  it('applies position multiplier', () => {
    expect(calculateSpotlightPrice(2, 1)).toBe(35); // Position 2 = 70%
  });
});
```

---

## Testing Strategy

### Critical Path Testing

**Must Test:**
- Authentication logic
- Permission checking
- Payment calculations
- Route optimization algorithms
- Data validation
- Date/time utilities

**Optional:**
- CRUD operations
- Simple UI components
- Database queries
- API error handling

**Skip:**
- UI snapshots
- E2E user flows (manual testing)
- Trivial getters/setters
- Third-party library behavior

### Manual Testing Checklist

Before each release:
- [ ] Test auth flow (signup, login, logout)
- [ ] Test garage sale creation
- [ ] Test map interactions
- [ ] Test admin features
- [ ] Test mobile responsiveness
- [ ] Test on different browsers

---

## Validation

### Success Criteria

- [x] Utility functions have tests
- [x] Business logic covered
- [x] Tests run in < 10 seconds
- [x] Zero flaky tests
- [x] Easy to add new tests

### Current Status (Jan 2025)

- **Test Files:** 5
- **Total Tests:** 25
- **Coverage:** ~40% (of shared package)
- **Run Time:** 3 seconds
- **Failures:** 0

---

## Future Enhancements

### Phase 2 (After MVP)

- [ ] Add integration tests for critical API routes
- [ ] Add React Testing Library for key components
- [ ] Implement CI/CD test automation
- [ ] Set up test coverage tracking

### Phase 3 (Scale)

- [ ] Consider E2E tests for critical flows
- [ ] Add visual regression testing
- [ ] Implement load testing
- [ ] Add performance benchmarks

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Write Tests Not Too Many](https://kentcdodds.com/blog/write-tests)

---

## Notes

### Testing Philosophy

> "Write tests. Not too many. Mostly integration."
> — Guillermo Rauch

We adapt this to: "Write tests for what matters. Skip the rest."

### Lessons Learned

1. **Tests as Documentation:** Tests show how functions should be used
2. **Fast Tests = More Tests:** Vitest's speed encourages testing
3. **Simple is Better:** Don't over-engineer tests
4. **Manual Testing OK:** For small team, manual testing is pragmatic
5. **Add Tests for Bugs:** When bugs occur, add test to prevent regression

### Related Decisions

- [ADR-0008 - TypeScript](./0008-typescript-everywhere.md)
- [ADR-0001 - Next.js](./0001-nextjs-app-router.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Quarterly (review testing coverage and strategy)
