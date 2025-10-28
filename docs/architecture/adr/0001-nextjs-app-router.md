# ADR-0001: Use Next.js 14 with App Router

**Status:** Accepted
**Date:** 2025-01-15
**Decision Makers:** Development Team
**Impact:** High

---

## Context

We need to choose a frontend framework for YK Buddy that supports:

- Server-side rendering (SSR) for SEO
- Static site generation (SSG) for performance
- API routes for backend logic
- File-based routing
- Strong TypeScript support
- Good developer experience
- Active community and ecosystem

### Requirements

1. **SEO-friendly** - Critical for tourism/visitor content
2. **Performance** - Fast page loads, especially on mobile
3. **Developer Productivity** - Quick to build features
4. **Scalability** - Handle growth from hundreds to thousands of users
5. **Cost** - Deployable on free/cheap hosting
6. **Maintenance** - Easy to maintain long-term

### Forces at Play

- **SEO:** Yellowknife tourism content must rank well in search engines
- **Mobile:** Many users will access on phones while traveling
- **Budget:** Limited funds, need free-tier hosting
- **Team:** Small team (1-2 developers)
- **Timeline:** 3-4 months to MVP

---

## Decision

**We will use Next.js 14 with the App Router** as our frontend framework.

### Approach

1. **Next.js 14** - Latest stable version with App Router
2. **App Router** - New routing system (vs Pages Router)
3. **React Server Components** - For server-side logic
4. **TypeScript** - Type-safe development
5. **Tailwind CSS** - Utility-first styling

### Rationale

- **Best-in-class SEO:** Server-side rendering by default
- **Performance:** React Server Components reduce client bundle size
- **DX:** File-based routing, hot reload, great tooling
- **Flexibility:** Mix SSR, SSG, and CSR as needed
- **Ecosystem:** Huge community, lots of resources
- **Vercel Deployment:** Seamless deployment to Vercel's free tier
- **API Routes:** Backend logic without separate server

---

## Alternatives Considered

### Alternative 1: Next.js Pages Router

**Description:** Use the older Pages Router instead of App Router

**Pros:**
- More mature, battle-tested
- More tutorials and examples available
- Simpler mental model

**Cons:**
- Older architecture
- Larger client bundles
- Missing React Server Components
- Will eventually be legacy

**Why not chosen:** App Router is the future of Next.js. Starting with Pages Router would require migration later.

### Alternative 2: Create React App

**Description:** Plain React with client-side rendering

**Pros:**
- Simple setup
- Familiar for React developers
- No server-side complexity

**Cons:**
- No SSR (terrible SEO)
- No built-in routing
- No API routes
- Poor performance on initial load
- CRA is deprecated

**Why not chosen:** SEO and performance are critical requirements. CRA doesn't meet them.

### Alternative 3: Gatsby

**Description:** Static site generator with React

**Pros:**
- Excellent static site performance
- GraphQL data layer
- Rich plugin ecosystem
- Good for content sites

**Cons:**
- Build times grow with content
- Complex data layer (GraphQL)
- Less flexible than Next.js
- Harder to add dynamic features
- Smaller community than Next.js

**Why not chosen:** YK Buddy needs dynamic features (garage sales, user auth, admin). Gatsby's static-first approach is limiting.

### Alternative 4: SvelteKit

**Description:** Modern framework with Svelte

**Pros:**
- Very fast runtime performance
- Smaller bundle sizes
- Simpler reactivity model
- Great developer experience

**Cons:**
- Smaller ecosystem
- Fewer developers know Svelte
- Less tooling and libraries
- Harder to hire developers
- Community smaller than React

**Why not chosen:** React/Next.js has much larger ecosystem and talent pool. Risk mitigation important for small team.

### Alternative 5: Remix

**Description:** Full-stack React framework

**Pros:**
- Excellent data loading patterns
- Progressive enhancement focus
- Modern architecture
- Great developer experience

**Cons:**
- Smaller community than Next.js
- Fewer hosting options
- Less mature ecosystem
- Steeper learning curve
- Requires more server-side thinking

**Why not chosen:** Next.js has better free hosting options (Vercel) and larger community. Remix adds complexity we don't need.

---

## Consequences

### Positive Consequences

- **Excellent SEO:** SSR ensures all content is crawlable
- **Great Performance:** Fast initial loads, optimized bundles
- **Developer Velocity:** Fast development with hot reload, file-based routing
- **Cost Effective:** Free tier on Vercel sufficient for MVP
- **Future-Proof:** App Router is the future of Next.js
- **Rich Ecosystem:** Tons of libraries, tutorials, examples
- **Easy Hiring:** React is the most popular frontend framework

### Negative Consequences

- **Learning Curve:** App Router is new, team needs to learn Server Components
- **Breaking Changes:** Next.js evolves quickly, occasional breaking changes
- **Build Complexity:** More complex than plain React
- **Vendor Coupling:** Tight coupling to Vercel ecosystem
- **Debugging:** Server Components can be harder to debug
- **Server Costs:** SSR requires server compute (mitigated by Vercel free tier)

### Risks

- **App Router Maturity:** App Router is relatively new (released 2023)
  - *Mitigation:* Next.js 14 is stable, App Router is production-ready

- **Vercel Dependency:** Heavy reliance on Vercel for deployment
  - *Mitigation:* Next.js can deploy to other platforms (AWS, Docker, etc.)

- **Performance at Scale:** Server rendering costs could grow
  - *Mitigation:* Can add caching, CDN, or migrate to static pages

---

## Implementation

### Action Items

- [x] Initialize Next.js 14 project with App Router
- [x] Set up TypeScript configuration
- [x] Configure Tailwind CSS
- [x] Create basic app structure (/app directory)
- [x] Implement layouts and templates
- [x] Set up environment variables
- [x] Configure ESLint and Prettier
- [x] Create reusable components
- [x] Set up API routes structure

### Key Decisions

1. **Use Server Components by default** - Add 'use client' only when needed
2. **File-based routing** - Follow Next.js conventions
3. **Layouts for shared UI** - Use nested layouts
4. **Route groups** - Organize routes logically
5. **Loading/Error states** - Use loading.tsx and error.tsx

### Project Structure

```
apps/web/
├── src/
│   ├── app/                 # App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── visiting/        # Visiting segment
│   │   ├── living/          # Living segment
│   │   ├── moving/          # Moving segment
│   │   ├── admin/           # Admin area
│   │   └── api/             # API routes
│   ├── components/          # Shared components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utilities
│   └── styles/              # Global styles
```

---

## Validation

### Success Criteria

- [x] All pages load in < 2 seconds on 3G
- [x] Lighthouse SEO score > 90
- [x] Build time < 2 minutes
- [x] Zero hydration errors
- [x] All routes accessible and functional

### Monitoring

- **Core Web Vitals:** Track LCP, FID, CLS via Vercel Analytics
- **Build Times:** Monitor CI/CD build duration
- **Bundle Size:** Track JavaScript bundle size
- **Error Rate:** Monitor Sentry for errors

---

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Vercel Deployment](https://vercel.com/docs)

---

## Notes

### Decision History

- 2025-01-10: Evaluated frameworks (Next.js, Gatsby, Remix, SvelteKit)
- 2025-01-12: Prototyped with Next.js App Router
- 2025-01-15: Decision accepted, full implementation started
- 2025-01-25: First production deployment successful

### Lessons Learned

1. **App Router Learning Curve:** Took ~1 week to fully understand Server Components
2. **Documentation:** Official docs are excellent, community resources growing
3. **Performance Wins:** RSC significantly reduced client bundle size
4. **SEO Results:** Google indexing all pages within days

### Related Decisions

- [ADR-0005 - Serverless Deployment](./0005-serverless-deployment.md)
- [ADR-0008 - TypeScript](./0008-typescript-everywhere.md)
- [ADR-0009 - Tailwind CSS](./0009-tailwind-css.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Annually or when Next.js major version released
