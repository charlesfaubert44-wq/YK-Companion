# ADR-0003: Adopt Monorepo Structure with Workspaces

**Status:** Accepted
**Date:** 2025-01-15
**Decision Makers:** Development Team
**Impact:** Medium

---

## Context

YK Buddy consists of multiple related packages that need to share code:

- **Web Application** - Next.js frontend
- **Shared Utilities** - Common functions, types
- **Type Definitions** - TypeScript interfaces
- **Future APIs** - Potential separate API services
- **Future Mobile App** - React Native app (planned)

### Requirements

1. **Code Sharing** - Utilities and types shared between packages
2. **Type Safety** - TypeScript types shared across packages
3. **Dependency Management** - Consistent versions across packages
4. **Build Coordination** - Build packages in correct order
5. **Developer Experience** - Easy to work across packages
6. **CI/CD** - Simple build and deployment pipeline

### Current Challenges

- Need to share utility functions between web and future mobile app
- Type definitions used across multiple packages
- Want to keep codebase organized and modular
- May split out API server in future

---

## Decision

**We will adopt a monorepo structure using npm workspaces** with the following organization:

```
yk-companion/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   ├── shared/           # Shared utilities
│   └── types/            # TypeScript type definitions
├── package.json          # Root package.json with workspaces
└── node_modules/         # Shared dependencies
```

### Approach

1. **npm Workspaces** - Built-in npm feature (npm 7+)
2. **Logical Organization** - Apps vs packages separation
3. **Local Dependencies** - Packages reference each other with `file:` protocol
4. **Shared node_modules** - Dependencies hoisted to root
5. **Independent Versioning** - Each package has own version

### Configuration

**Root package.json:**
```json
{
  "name": "yk-companion",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Package References:**
```json
{
  "dependencies": {
    "@yk-trip-planner/shared": "file:../../packages/shared",
    "@yk-trip-planner/types": "file:../../packages/types"
  }
}
```

---

## Alternatives Considered

### Alternative 1: Polyrepo (Multiple Repositories)

**Description:** Separate git repositories for each package

**Pros:**
- Complete independence
- Separate CI/CD pipelines
- Clear ownership boundaries
- Can have different access controls

**Cons:**
- Hard to share code
- Version synchronization difficult
- Changes across packages require multiple PRs
- Dependency management complex
- Harder to refactor across packages

**Why not chosen:** Code sharing is critical. Polyrepo makes shared utilities painful to manage.

### Alternative 2: Lerna

**Description:** Monorepo tool built on top of npm/yarn

**Pros:**
- Mature tool, widely used
- Handles versioning and publishing
- Good for published packages
- Bootstrap command useful

**Cons:**
- Extra tool to learn
- Adds complexity
- npm workspaces now built-in
- Overkill for internal packages
- Maintenance overhead

**Why not chosen:** npm workspaces sufficient for our needs. Don't need Lerna's publishing features since packages are internal.

### Alternative 3: Turborepo

**Description:** High-performance build system for monorepos

**Pros:**
- Intelligent caching
- Parallel execution
- Remote caching
- Great for large monorepos
- Fast builds

**Cons:**
- Additional tool and config
- Complexity overhead
- Our monorepo is small
- npm workspaces + scripts sufficient
- May be premature optimization

**Why not chosen:** Our monorepo is small (2-3 packages). Turborepo's benefits don't justify the added complexity yet. Can add later if needed.

### Alternative 4: Nx

**Description:** Powerful monorepo toolkit with many features

**Pros:**
- Excellent tooling
- Dependency graph visualization
- Affected command (only build what changed)
- Great for large teams
- Plugin ecosystem

**Cons:**
- Heavy tooling
- Steep learning curve
- Opinionated structure
- Overkill for small monorepo
- Complex configuration

**Why not chosen:** Too much tooling for a 2-person team with 3 packages. npm workspaces is simpler and sufficient.

### Alternative 5: Yarn Workspaces

**Description:** Yarn's built-in workspace feature

**Pros:**
- Similar to npm workspaces
- Slightly faster installs
- Good workspace support
- Plug'n'Play mode

**Cons:**
- Requires Yarn (additional tool)
- npm workspaces now equally good
- Team already uses npm
- One more tool to manage

**Why not chosen:** npm workspaces works fine. No need to add Yarn as a dependency.

---

## Consequences

### Positive Consequences

- **Easy Code Sharing:** Import shared utilities with normal imports
- **Type Safety:** Shared types automatically available
- **Single Install:** One `npm install` at root installs everything
- **Consistent Dependencies:** All packages use same versions
- **Atomic Changes:** Changes across packages in single PR
- **Simpler CI/CD:** One build pipeline for everything
- **Better Refactoring:** Can refactor across packages easily
- **No Publishing:** Internal packages don't need to be published

### Negative Consequences

- **Larger Repository:** All code in one repo
- **Shared Dependencies:** Can't have different versions per package (usually)
- **Build Order:** Must build dependencies before dependents
- **Commit Noise:** Changes to multiple packages in one commit
- **Git History:** Can be harder to track package-specific changes
- **Initial Setup:** Slightly more complex initial configuration

### Risks

- **Dependency Conflicts:** Different packages might need different versions
  - *Mitigation:* Use peer dependencies, or allow duplicates when needed

- **Build Complexity:** Build order must be managed
  - *Mitigation:* Use prebuild scripts, document build order

- **Scaling:** May need better tooling if monorepo grows significantly
  - *Mitigation:* Can add Turborepo/Nx later if needed

---

## Implementation

### Directory Structure

```
yk-companion/
├── apps/
│   └── web/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── types/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── package.json          # Workspace root
├── tsconfig.json         # Shared TS config
└── .gitignore
```

### Package Organization

**apps/web** - Main Next.js application
- Depends on: @yk-trip-planner/shared, @yk-trip-planner/types
- Contains: Pages, components, API routes

**packages/shared** - Shared utilities
- Depends on: @yk-trip-planner/types
- Contains: Utility functions, helpers, constants
- Examples: date formatting, validation, URL helpers

**packages/types** - Type definitions
- No dependencies
- Contains: TypeScript interfaces, types, enums
- Examples: User, GarageSale, Sponsor types

### Build Process

1. **Install dependencies:**
   ```bash
   npm install  # At root, installs all workspace dependencies
   ```

2. **Build packages (in order):**
   ```bash
   cd packages/types && npm run build
   cd packages/shared && npm run build
   cd apps/web && npm run build
   ```

3. **Development:**
   ```bash
   npm run dev:web  # Runs from root
   ```

### Scripts Configuration

**Root package.json:**
```json
{
  "scripts": {
    "dev:web": "cd apps/web && npm run dev",
    "build:web": "cd apps/web && npm run prebuild && npm run build",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

**apps/web/package.json:**
```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "prebuild": "cd ../../packages/types && npm install && npm run build && cd ../shared && npm install && npm run build",
    "build": "next build"
  }
}
```

### TypeScript Configuration

**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Package tsconfig.json extends root:**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## Validation

### Success Criteria

- [x] Can import shared utilities from web app
- [x] TypeScript types resolve correctly
- [x] Single `npm install` at root works
- [x] Build process completes successfully
- [x] No duplicate dependencies (except where necessary)
- [x] Changes to shared package reflect in web app

### Testing

```typescript
// In apps/web/src/app/page.tsx
import { formatDate } from '@yk-trip-planner/shared';
import { User } from '@yk-trip-planner/types';

// Types and functions work correctly
const user: User = { id: '1', email: 'test@example.com' };
const date = formatDate(new Date());
```

### Current Status (Jan 2025)

- Monorepo structure implemented
- 3 packages: web app, shared, types
- Build process working smoothly
- No issues with dependency management

---

## Developer Workflow

### Adding a New Shared Utility

1. Add function to `packages/shared/src/`
2. Export from `packages/shared/src/index.ts`
3. Build shared package: `cd packages/shared && npm run build`
4. Import in web app: `import { myUtil } from '@yk-trip-planner/shared'`

### Adding a New Type

1. Add interface to `packages/types/src/`
2. Export from `packages/types/src/index.ts`
3. Build types package: `cd packages/types && npm run build`
4. Import in any package: `import { MyType } from '@yk-trip-planner/types'`

### Working Across Packages

1. Make changes in multiple packages
2. Build dependencies: `cd packages/types && npm run build`
3. Test in web app: `npm run dev:web`
4. Commit all changes together

---

## Future Considerations

### When to Add Turborepo/Nx

Consider adding if:
- Monorepo grows to 10+ packages
- Build times become slow (> 5 minutes)
- Team grows to 5+ developers
- Need remote caching
- Want dependency graph visualization

### Adding More Packages

**Future packages might include:**
- `packages/ui` - Shared UI components
- `apps/mobile` - React Native mobile app
- `apps/api` - Separate API server
- `packages/database` - Database utilities
- `packages/config` - Shared configuration

### CI/CD Optimization

For now: Build everything on every commit

Future optimization:
- Detect changed packages
- Only build/test affected packages
- Use Turborepo for this

---

## References

- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

## Notes

### Decision History

- 2025-01-12: Discussed code organization
- 2025-01-15: Decided on npm workspaces approach
- 2025-01-16: Implemented monorepo structure
- 2025-01-17: Moved shared code into packages

### Lessons Learned

1. **Prebuild Scripts Work:** Using prebuild to build dependencies is simple and effective
2. **file: Protocol:** Using `file:` for local dependencies works well
3. **Hoisting Works:** Dependency hoisting to root saves space
4. **Simple is Good:** npm workspaces is simple enough for our needs
5. **Can Scale:** Easy to add Turborepo later if needed

### Package Evolution

- Week 1: Started with single package (web app)
- Week 2: Extracted types package
- Week 3: Created shared utilities package
- Current: 3 packages, considering UI package

### Related Decisions

- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)
- [ADR-0008 - TypeScript](./0008-typescript-everywhere.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Annually or when adding new packages
