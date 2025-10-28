# YK Buddy Architecture Documentation

> Comprehensive architecture documentation for the YK Buddy platform - Your Yellowknife Companion

**Last Updated:** January 2025
**Version:** 1.0.0
**Status:** Production Ready

---

## Table of Contents

- [Overview](#overview)
- [Quick Links](#quick-links)
- [Documentation Structure](#documentation-structure)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Getting Started](#getting-started)

---

## Overview

YK Buddy is a multi-segment community platform built with modern web technologies, serving visitors, residents, and people moving to Yellowknife, Northwest Territories. This documentation provides a comprehensive view of the system architecture, design decisions, and technical implementation.

### Key Characteristics

- **Architecture Style:** Monolithic Next.js application with modular features
- **Deployment Model:** Serverless (Vercel) + Managed Database (Supabase)
- **Primary Technologies:** Next.js 14, TypeScript, PostgreSQL, React
- **Scale Target:** Community-scale (thousands of users)
- **Cost Model:** Free-tier optimized (~$1/month)

---

## Quick Links

### Architecture Views

- **[C4 Model Diagrams](./c4-model/README.md)** - System Context, Container, Component views
- **[Arc42 Documentation](./arc42/README.md)** - Comprehensive architecture documentation
- **[Architecture Decision Records](./adr/README.md)** - Key technical decisions

### Technical Documentation

- **[Data Architecture](./data-architecture.md)** - Database schema, data flows, storage strategy
- **[Security Architecture](./security-architecture.md)** - Auth, permissions, RLS, threat model
- **[API Architecture](./api-architecture.md)** - API design, endpoints, contracts
- **[Frontend Architecture](./frontend-architecture.md)** - Component structure, state management, UI patterns

### Operational Documentation

- **[Deployment Architecture](./deployment-architecture.md)** - Infrastructure, CI/CD, environments
- **[Monitoring & Observability](./monitoring-architecture.md)** - Logging, metrics, alerting
- **[Performance Architecture](./performance-architecture.md)** - Optimization, caching, CDN strategy

---

## Documentation Structure

```
docs/architecture/
├── README.md                          # This file - main index
│
├── c4-model/                          # C4 Model diagrams
│   ├── README.md                      # C4 overview
│   ├── 01-system-context.md           # Level 1: System context
│   ├── 02-container-diagram.md        # Level 2: Containers
│   ├── 03-component-diagram.md        # Level 3: Components
│   └── diagrams/                      # Mermaid diagram source files
│
├── arc42/                             # Arc42 documentation template
│   ├── README.md                      # Arc42 overview
│   ├── 01-introduction.md             # Requirements & goals
│   ├── 02-constraints.md              # Architecture constraints
│   ├── 03-context-scope.md            # System scope & context
│   ├── 04-solution-strategy.md        # Solution strategy
│   ├── 05-building-blocks.md          # Building block view
│   ├── 06-runtime-view.md             # Runtime scenarios
│   ├── 07-deployment-view.md          # Deployment infrastructure
│   ├── 08-crosscutting-concepts.md    # Cross-cutting concerns
│   ├── 09-design-decisions.md         # Architectural decisions
│   ├── 10-quality-requirements.md     # Quality attributes
│   ├── 11-risks-technical-debt.md     # Risks & technical debt
│   └── 12-glossary.md                 # Terminology
│
├── adr/                               # Architecture Decision Records
│   ├── README.md                      # ADR index
│   ├── template.md                    # ADR template
│   ├── 0001-nextjs-app-router.md      # Why Next.js App Router
│   ├── 0002-supabase-backend.md       # Why Supabase
│   ├── 0003-monorepo-structure.md     # Monorepo organization
│   ├── 0004-row-level-security.md     # Database security approach
│   ├── 0005-serverless-deployment.md  # Vercel deployment
│   ├── 0006-mapbox-integration.md     # Map provider choice
│   └── 0007-multilingual-support.md   # i18n implementation
│
├── data-architecture.md               # Data models & flows
├── security-architecture.md           # Security design
├── api-architecture.md                # API structure
├── frontend-architecture.md           # Frontend patterns
├── deployment-architecture.md         # Infrastructure & deployment
├── monitoring-architecture.md         # Observability setup
└── performance-architecture.md        # Performance optimization
```

---

## Architecture at a Glance

### System Context

```
┌─────────────┐         ┌──────────────────┐         ┌────────────┐
│  Visitors   │◄───────►│                  │◄───────►│  Supabase  │
│  Residents  │         │    YK Buddy      │         │  Database  │
│   Movers    │         │  Web Platform    │         │            │
└─────────────┘         │                  │         └────────────┘
                        │                  │
┌─────────────┐         │                  │         ┌────────────┐
│   Admins    │◄───────►│                  │◄───────►│   Mapbox   │
└─────────────┘         └──────────────────┘         │    API     │
                                                      └────────────┘
```

### Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **State Management** | React Context, Zustand, TanStack Query |
| **Backend** | Next.js API Routes, Supabase (PostgreSQL, Auth) |
| **Maps** | Mapbox GL JS, React Map GL |
| **Deployment** | Vercel (Frontend), Supabase (Database) |
| **Testing** | Vitest, Testing Library |
| **CI/CD** | GitHub Actions, Vercel Previews |

### Key Features Architecture

#### 1. Multi-Segment Platform (Visiting, Living, Moving)
- Feature-based routing (`/visiting`, `/living`, `/moving`)
- Shared component library with segment customization
- Aurora-themed visual design system

#### 2. Premium Spotlight System
- Admin-managed sponsor placements
- Position-based pricing with volume discounts
- Real-time availability checking
- Payment tracking and expiration management

#### 3. Garage Sale Planner
- Interactive Mapbox integration
- Geolocation and distance calculation
- Route optimization with TSP algorithm
- User-created content with approval workflow

#### 4. Knowledge Base System
- Multi-language content management
- Admin moderation and approval
- Category-based organization
- Search and filtering capabilities

#### 5. Admin Dashboard
- Role-based access control (RBAC)
- Granular permission management
- Activity logging and audit trail
- Real-time analytics and monitoring

#### 6. Multilingual Support
- 9 languages supported
- Context-based i18n
- localStorage persistence
- Easy language extension

---

## Getting Started

### For Developers

1. **Understand the System Context**
   - Start with [C4 System Context](./c4-model/01-system-context.md)
   - Review [Solution Strategy](./arc42/04-solution-strategy.md)

2. **Explore the Technical Stack**
   - Read [Frontend Architecture](./frontend-architecture.md)
   - Review [Data Architecture](./data-architecture.md)
   - Check [API Architecture](./api-architecture.md)

3. **Understand Key Decisions**
   - Browse [Architecture Decision Records](./adr/README.md)
   - Review [Design Decisions](./arc42/09-design-decisions.md)

### For Architects

1. **Review High-Level Architecture**
   - [Arc42 Introduction](./arc42/01-introduction.md)
   - [System Context & Scope](./arc42/03-context-scope.md)
   - [Solution Strategy](./arc42/04-solution-strategy.md)

2. **Analyze Quality Attributes**
   - [Quality Requirements](./arc42/10-quality-requirements.md)
   - [Performance Architecture](./performance-architecture.md)
   - [Security Architecture](./security-architecture.md)

3. **Assess Risks and Constraints**
   - [Constraints](./arc42/02-constraints.md)
   - [Risks & Technical Debt](./arc42/11-risks-technical-debt.md)

### For Stakeholders

1. **Understand Business Context**
   - [Introduction & Goals](./arc42/01-introduction.md)
   - [System Context](./c4-model/01-system-context.md)

2. **Review Deployment**
   - [Deployment Architecture](./deployment-architecture.md)
   - [Infrastructure Overview](./arc42/07-deployment-view.md)

---

## Architecture Principles

### 1. Simplicity First
- Prefer simple solutions over complex ones
- Avoid premature optimization
- Use managed services when possible

### 2. Cost-Conscious Design
- Optimize for free-tier limits
- Minimize infrastructure complexity
- Use serverless where appropriate

### 3. Developer Experience
- TypeScript for type safety
- Clear code organization
- Comprehensive documentation

### 4. User-Centric Performance
- Mobile-first responsive design
- Optimistic UI updates
- Progressive enhancement

### 5. Security by Default
- Row-level security in database
- Secure authentication flows
- Permission-based access control

### 6. Maintainability
- Modular architecture
- Clear separation of concerns
- Automated testing where valuable

---

## Contributing to Architecture Documentation

### Documentation Standards

1. **Use Mermaid for Diagrams** - All diagrams should be code-based using Mermaid syntax
2. **Follow Arc42 Template** - Use Arc42 sections for structured documentation
3. **Create ADRs for Decisions** - Document significant architecture decisions
4. **Keep it Current** - Update docs when architecture changes
5. **Link Liberally** - Cross-reference related documentation

### Creating an ADR

```bash
# Use the ADR template
cp docs/architecture/adr/template.md docs/architecture/adr/NNNN-decision-title.md
# Fill in: Status, Context, Decision, Consequences
```

### Updating Diagrams

```bash
# Edit Mermaid diagrams directly in markdown
# Diagrams render automatically in GitHub and most markdown viewers
```

---

## Maintenance

### Review Schedule

- **Monthly:** Review and update key diagrams
- **Quarterly:** Full Arc42 documentation review
- **Per Release:** Update deployment and component diagrams
- **As Needed:** Create ADRs for significant decisions

### Ownership

- **Architecture Lead:** Maintains Arc42 and C4 documentation
- **Dev Team:** Creates ADRs, updates component diagrams
- **DevOps:** Maintains deployment and infrastructure docs
- **Security:** Maintains security architecture documentation

---

## Additional Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [C4 Model](https://c4model.com/)
- [Arc42](https://arc42.org/)
- [ADR Guidelines](https://adr.github.io/)

### Project Documentation

- [Main README](../../README.md)
- [Current Features](../../CURRENT_FEATURES.md)
- [Database Schema](../database-schema.md)
- [Development Guide](../development-guide.md)
- [Deployment Guide](../../DEPLOYMENT_GUIDE.md)

---

**Questions or suggestions?** Open an issue or contact the development team.

**Made with ❤️ in Yellowknife**
