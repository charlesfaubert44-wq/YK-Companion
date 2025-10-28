# Architecture Decision Records (ADR)

> Documenting significant architecture decisions for YK Buddy

**Standard:** [ADR Guidelines](https://adr.github.io/)
**Status:** Active
**Last Updated:** January 2025

---

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences. ADRs help teams:

- Understand why decisions were made
- Onboard new team members faster
- Avoid repeating discussions
- Track the evolution of the architecture
- Learn from past decisions

---

## When to Create an ADR

Create an ADR when you make a decision that:

1. **Affects the structure** - Changes to major components or modules
2. **Impacts non-functional requirements** - Performance, security, scalability
3. **Introduces new dependencies** - Third-party services, libraries, frameworks
4. **Changes development practices** - Testing strategy, deployment approach
5. **Has significant trade-offs** - Decisions with important pros/cons
6. **Is hard to reverse** - Decisions with high cost to change later

---

## ADR Index

| # | Title | Status | Date | Impact |
|---|-------|--------|------|--------|
| [0001](./0001-nextjs-app-router.md) | Use Next.js 14 with App Router | Accepted | 2025-01 | High |
| [0002](./0002-supabase-backend.md) | Use Supabase for Backend Services | Accepted | 2025-01 | High |
| [0003](./0003-monorepo-structure.md) | Adopt Monorepo Structure | Accepted | 2025-01 | Medium |
| [0004](./0004-row-level-security.md) | Implement Row-Level Security | Accepted | 2025-01 | High |
| [0005](./0005-serverless-deployment.md) | Deploy on Vercel Serverless | Accepted | 2025-01 | High |
| [0006](./0006-mapbox-integration.md) | Use Mapbox for Maps | Accepted | 2025-01 | Medium |
| [0007](./0007-multilingual-support.md) | Implement Context-Based i18n | Accepted | 2025-01 | Medium |
| [0008](./0008-typescript-everywhere.md) | Use TypeScript Throughout | Accepted | 2025-01 | Medium |
| [0009](./0009-tailwind-css.md) | Use Tailwind CSS for Styling | Accepted | 2025-01 | Low |
| [0010](./0010-testing-strategy.md) | Pragmatic Testing Approach | Accepted | 2025-01 | Medium |

---

## ADR Statuses

- **Proposed** - Decision under consideration
- **Accepted** - Decision approved and implemented
- **Deprecated** - No longer relevant but kept for historical context
- **Superseded** - Replaced by a newer decision (link to new ADR)
- **Rejected** - Proposal was considered but not accepted

---

## Creating a New ADR

### 1. Use the Template

```bash
cp docs/architecture/adr/template.md docs/architecture/adr/NNNN-your-decision.md
```

### 2. Fill in the Sections

- **Title:** Short, descriptive noun phrase
- **Status:** Start with "Proposed"
- **Context:** What's the situation prompting this decision?
- **Decision:** What are we doing about it?
- **Consequences:** What are the positive and negative results?

### 3. Get Review

- Share with the team
- Gather feedback
- Update based on discussion
- Mark as "Accepted" when consensus reached

### 4. Add to Index

Update this README.md with the new ADR entry.

---

## ADR Template

See [template.md](./template.md) for the full ADR template.

---

## ADR Guidelines

### Writing Style

- **Be Concise** - ADRs should be quick to read (1-2 pages)
- **Be Specific** - Include concrete details and examples
- **Be Honest** - Document trade-offs and negative consequences
- **Be Timeless** - Write for future readers who weren't present

### Content Guidelines

#### Good Context Section
```
We need to choose a database for YK Buddy. Requirements:
- Support for 1,000+ users
- Strong ACID guarantees
- Geospatial queries for garage sale locations
- Authentication integration
- Budget: $0-50/month
```

#### Good Decision Section
```
We will use Supabase (managed PostgreSQL) because:
1. Built on PostgreSQL with full SQL support
2. Includes authentication service
3. PostGIS extension for geospatial queries
4. Free tier sufficient for our scale
5. Row-level security for multi-tenancy
```

#### Good Consequences Section
```
Positive:
- Fast development with built-in features
- Strong consistency and ACID compliance
- Rich ecosystem of PostgreSQL tools
- Scales to millions of users if needed

Negative:
- Vendor lock-in to Supabase platform
- Limited to PostgreSQL (no NoSQL flexibility)
- Cold starts on free tier
- Must manage database schema migrations
```

---

## By Category

### Technology Choices
- [0001 - Next.js App Router](./0001-nextjs-app-router.md)
- [0002 - Supabase Backend](./0002-supabase-backend.md)
- [0006 - Mapbox Integration](./0006-mapbox-integration.md)
- [0008 - TypeScript](./0008-typescript-everywhere.md)
- [0009 - Tailwind CSS](./0009-tailwind-css.md)

### Architecture Patterns
- [0003 - Monorepo Structure](./0003-monorepo-structure.md)
- [0004 - Row-Level Security](./0004-row-level-security.md)
- [0007 - Multilingual Support](./0007-multilingual-support.md)

### Infrastructure
- [0005 - Serverless Deployment](./0005-serverless-deployment.md)

### Development Practices
- [0010 - Testing Strategy](./0010-testing-strategy.md)

---

## Related Documentation

- **[C4 Model Diagrams](../c4-model/README.md)**
- **[Arc42 Documentation](../arc42/README.md)**
- **[Architecture Index](../README.md)**

---

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)
- [When to Write an ADR](https://github.com/joelparkerhenderson/architecture-decision-record#when-to-write-an-adr)

---

**Maintained By:** Development Team
**Review Cycle:** ADRs reviewed when superseded or deprecated
**Questions?** Open a GitHub issue or ask in team chat
