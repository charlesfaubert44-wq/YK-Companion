# ADR-0008: Use TypeScript Throughout the Codebase

**Status:** Accepted
**Date:** 2025-01-15
**Decision Makers:** Development Team
**Impact:** Medium

---

## Context

We need to choose between JavaScript and TypeScript for YK Buddy development. Key considerations:

- **Type Safety** - Catch errors at compile time
- **Developer Experience** - Better IDE support and autocomplete
- **Maintainability** - Easier to refactor and understand code
- **Team Size** - Small team (1-2 developers)
- **Complexity** - Balance between safety and productivity

---

## Decision

**We will use TypeScript for all code** (frontend, API routes, utilities, types) with strict mode enabled.

### Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Alternatives Considered

### Alternative 1: JavaScript Only

**Pros:** Simpler, no compilation, faster to write
**Cons:** No type safety, more runtime errors, poor IDE support
**Why not chosen:** Type safety is critical for maintainability

### Alternative 2: JavaScript with JSDoc

**Pros:** Types without TypeScript, incremental adoption
**Cons:** Limited type features, verbose, not enforced
**Why not chosen:** JSDoc not as powerful as TypeScript

### Alternative 3: TypeScript with Loose Config

**Pros:** Easier migration, less strict
**Cons:** Loses many TypeScript benefits
**Why not chosen:** Want full type safety benefits

---

## Consequences

### Positive Consequences

- **Catch Errors Early** - Type errors found at compile time
- **Better IDE Support** - Autocomplete, inline documentation, refactoring
- **Self-Documenting** - Types serve as documentation
- **Safer Refactoring** - Can refactor confidently
- **Better Collaboration** - Types make code intent clear
- **Next.js Integration** - First-class TypeScript support

### Negative Consequences

- **Learning Curve** - Team must learn TypeScript
- **Compilation Step** - Extra build step (minimal with Next.js)
- **More Verbose** - Type annotations add code
- **Type Complexity** - Complex types can be hard to understand

---

## Implementation

### Type Organization

```
packages/types/src/
├── index.ts           # Re-exports all types
├── user.ts            # User-related types
├── garage-sale.ts     # Garage sale types
├── sponsor.ts         # Sponsor types
├── knowledge.ts       # Knowledge base types
└── common.ts          # Shared utility types
```

### Example Types

```typescript
// packages/types/src/user.ts
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPermissions {
  user_id: string;
  is_super_admin: boolean;
  can_manage_users: boolean;
  can_manage_sponsors: boolean;
  can_manage_content: boolean;
  can_manage_garage_sales: boolean;
  can_view_analytics: boolean;
  can_manage_settings: boolean;
}

// Type guards
export function isAdmin(user: User | null): boolean {
  return user?.is_admin ?? false;
}
```

### Strict Mode Benefits

With `strict: true`, we get:
- `noImplicitAny` - Must type all parameters
- `strictNullChecks` - Must handle null/undefined
- `strictFunctionTypes` - Contravariant function parameters
- `strictBindCallApply` - Type-safe bind/call/apply

---

## Validation

### Success Criteria

- [x] All files use .ts or .tsx extension
- [x] Strict mode enabled, zero errors
- [x] Shared types in packages/types
- [x] API responses typed
- [x] Form data typed with Zod integration

### Current Status (Jan 2025)

- **Files:** 100% TypeScript (.ts/.tsx)
- **Strict mode:** Enabled
- **Type coverage:** ~95% (some any types in third-party)
- **Type errors:** 0

---

## Best Practices

### Do's

✅ Use strict mode
✅ Avoid `any` type
✅ Use type guards for runtime checks
✅ Share types via packages/types
✅ Use Zod for runtime validation

### Don'ts

❌ Use `any` instead of `unknown`
❌ Disable strict checks
❌ Duplicate types across files
❌ Skip null checks
❌ Use `@ts-ignore` without comment

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## Notes

### Related Decisions

- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)
- [ADR-0003 - Monorepo Structure](./0003-monorepo-structure.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Annually
