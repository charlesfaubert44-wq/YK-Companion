# Testing Guide for YK Buddy

This guide explains how to set up and run tests for the YK Buddy application.

## Quick Start

### 1. Install Testing Dependencies

```bash
cd apps/web
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- AuthContext
```

## Test Structure

Tests are organized in the `__tests__` directory:

```
apps/web/
├── __tests__/
│   ├── auth/
│   │   └── AuthContext.test.tsx    # Authentication tests
│   └── utils/
│       └── weather.test.ts         # Utility function tests
├── jest.config.js                   # Jest configuration
└── jest.setup.js                    # Test setup/mocks
```

## Example Tests

### Testing Authentication Flow

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

it('should sign in user successfully', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  const response = await result.current.signIn(
    'test@example.com',
    'password123'
  );

  expect(response.error).toBeNull();
});
```

### Testing Utility Functions

```typescript
import { getWeatherEmoji } from '@/hooks/useWeather';

it('should return sun emoji for clear day', () => {
  const emoji = getWeatherEmoji('Clear', '01d');
  expect(emoji).toBe('☀️');
});
```

## Writing Tests

### 1. Component Tests

For React components, use `@testing-library/react`:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. Hook Tests

For custom hooks, use `renderHook`:

```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

it('should return expected value', () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current.value).toBe('expected');
});
```

### 3. Async Tests

Use `waitFor` for async operations:

```typescript
import { waitFor } from '@testing-library/react';

it('handles async operation', async () => {
  const { result } = renderHook(() => useAsyncHook());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## Mocking

### Mocking External Dependencies

```typescript
// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
  })),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));
```

### Mocking API Calls

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mock data' }),
    ok: true,
  })
) as jest.Mock;
```

## Best Practices

### 1. Test Organization

- One test file per component/hook/utility
- Group related tests with `describe` blocks
- Use descriptive test names with `it('should...')`

### 2. Test Coverage

Aim for:
- **Critical paths**: 100% (auth, payments)
- **Components**: 80%+
- **Utilities**: 90%+
- **Overall**: 70%+

### 3. What to Test

✅ **DO test:**
- User interactions (clicks, form submissions)
- Conditional rendering
- Edge cases and error states
- Data transformations
- API integrations

❌ **DON'T test:**
- Implementation details
- Third-party libraries
- CSS styles (use snapshot tests sparingly)
- Trivial getters/setters

### 4. Test Independence

Each test should:
- Run independently
- Not rely on other tests
- Clean up after itself
- Not affect global state

### 5. Readable Tests

```typescript
// ✅ Good: Clear and descriptive
it('should display error message when email is invalid', () => {
  // ...
});

// ❌ Bad: Unclear purpose
it('works', () => {
  // ...
});
```

## Running Tests in CI/CD

Add to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Debugging Tests

### 1. Run Single Test

```bash
npm test -- AuthContext.test.tsx
```

### 2. Use `debug()`

```typescript
import { render, screen } from '@testing-library/react';

it('debugging test', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints DOM to console
});
```

### 3. Use `screen.logTestingPlaygroundURL()`

```typescript
import { screen } from '@testing-library/react';

it('find selectors', () => {
  render(<MyComponent />);
  screen.logTestingPlaygroundURL(); // Opens testing playground
});
```

## Common Issues

### Issue: "Cannot find module"

**Solution:** Check `moduleNameMapper` in `jest.config.js`

### Issue: "window is not defined"

**Solution:** Add to `jest.setup.js`:

```javascript
global.window = {};
```

### Issue: "localStorage is not defined"

**Solution:** Add mock to `jest.setup.js`:

```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

1. ✅ Run example tests to verify setup
2. Add tests for your critical features
3. Set up coverage thresholds
4. Integrate with CI/CD pipeline
5. Add E2E tests with Playwright or Cypress

---

**Happy Testing!** 🧪

