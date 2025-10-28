# ADR-0002: Use Supabase for Backend Services

**Status:** Accepted
**Date:** 2025-01-16
**Decision Makers:** Development Team
**Impact:** High

---

## Context

We need a backend solution for YK Buddy that provides:

- **Database:** PostgreSQL with full SQL support
- **Authentication:** User management, OAuth, email verification
- **Real-time:** Optional real-time subscriptions (future)
- **Storage:** File uploads for images (future)
- **Security:** Row-level security and access control
- **Scalability:** Handle growth without infrastructure management
- **Cost:** Free tier sufficient for MVP

### Requirements

1. **Relational Database** - Complex queries, transactions, geospatial data
2. **Built-in Auth** - Don't want to build authentication from scratch
3. **Developer Productivity** - Quick to set up and iterate
4. **PostgreSQL** - Rich ecosystem, battle-tested
5. **Budget** - $0-50/month
6. **Security** - Multi-tenancy, data isolation

### Current Situation

- Small team (1-2 developers)
- Limited DevOps experience
- No budget for dedicated servers
- Need to launch in 3-4 months
- Planning for 1,000+ users in first year

---

## Decision

**We will use Supabase as our Backend-as-a-Service (BaaS) platform**, providing:

- PostgreSQL database
- Authentication service
- Row-level security (RLS)
- Auto-generated REST API
- Real-time subscriptions (future)
- File storage (future)

### Approach

1. **Supabase Hosted PostgreSQL** - Managed database
2. **Supabase Auth** - Email/password + OAuth
3. **Direct SQL Access** - Full PostgreSQL features
4. **Row-Level Security** - Database-level access control
5. **Migrations** - Version-controlled schema changes
6. **Supabase Client Libraries** - @supabase/supabase-js, @supabase/ssr

### Rationale

- **PostgreSQL Foundation** - Full SQL, ACID, PostGIS for geospatial
- **Built-in Auth** - Saves weeks of development time
- **Row-Level Security** - Database enforces access control
- **Free Tier** - 500MB storage, 50,000 monthly active users
- **Scales Up** - Can upgrade as we grow
- **Open Source** - Can self-host if needed
- **Great DX** - Excellent documentation, CLI tools

---

## Alternatives Considered

### Alternative 1: Firebase

**Description:** Google's BaaS with Firestore database

**Pros:**
- Mature, battle-tested platform
- Excellent real-time capabilities
- Great mobile SDK support
- Generous free tier
- Google infrastructure

**Cons:**
- NoSQL database (Firestore) - limits complex queries
- Vendor lock-in (proprietary database)
- Less flexible than SQL
- Offline querying can be complex
- Migration from Firebase is difficult

**Why not chosen:** Need SQL for complex queries (garage sale filtering, geospatial queries, analytics). NoSQL too limiting.

### Alternative 2: AWS Amplify

**Description:** AWS's BaaS with DynamoDB or Aurora

**Pros:**
- Full AWS ecosystem integration
- Highly scalable
- Multiple database options
- Comprehensive services

**Cons:**
- Complex setup and configuration
- DynamoDB is NoSQL (same issues as Firebase)
- Aurora PostgreSQL is expensive
- Steep learning curve
- Overwhelming number of services

**Why not chosen:** Too complex for small team. Cost adds up quickly. Amplify DX not as good as Supabase.

### Alternative 3: PlanetScale

**Description:** Serverless MySQL with branching

**Pros:**
- Excellent database branching
- Serverless scaling
- Great for development workflow
- Good free tier

**Cons:**
- MySQL not PostgreSQL (no PostGIS)
- No built-in auth
- No real-time subscriptions
- Would need separate auth service
- Less mature than Supabase

**Why not chosen:** Need PostgreSQL for PostGIS (geospatial queries). No built-in auth means extra work.

### Alternative 4: Self-Hosted PostgreSQL + Auth0

**Description:** Run our own PostgreSQL and use Auth0 for authentication

**Pros:**
- Full control over infrastructure
- Can optimize exactly as needed
- No vendor lock-in for database
- Auth0 is excellent

**Cons:**
- Requires DevOps expertise
- Must handle backups, scaling, monitoring
- Higher operational burden
- Auth0 gets expensive fast
- No free tier after trial

**Why not chosen:** Team lacks DevOps expertise. Want to focus on features, not infrastructure. Cost and complexity too high.

### Alternative 5: Prisma + PostgreSQL + NextAuth

**Description:** Custom stack with Prisma ORM, self-hosted DB, NextAuth

**Pros:**
- Full control
- Type-safe database access (Prisma)
- NextAuth integrates well with Next.js
- Can host anywhere

**Cons:**
- Must manage database hosting
- Manual security implementation
- No built-in RLS
- More code to write and maintain
- Higher operational complexity

**Why not chosen:** Want database-level security (RLS). Don't want to manage PostgreSQL hosting. Supabase provides everything this would.

---

## Consequences

### Positive Consequences

- **Fast Development** - Auth and database ready in minutes
- **PostgreSQL Power** - Full SQL, transactions, triggers, functions
- **Row-Level Security** - Database enforces access control automatically
- **PostGIS Support** - Geospatial queries for garage sale locations
- **Great Documentation** - Excellent docs, tutorials, examples
- **Active Community** - Large Discord, responsive support
- **Open Source** - Can self-host if needed (exit strategy)
- **Cost Effective** - Free tier sufficient for MVP
- **Automatic Backups** - Point-in-time recovery included

### Negative Consequences

- **Vendor Lock-in** - Tightly coupled to Supabase platform
- **Cold Starts** - Free tier has occasional cold starts
- **Limited Compute** - Free tier compute limits
- **Dashboard Limitations** - Some complex operations need SQL editor
- **Real-time Costs** - Real-time subscriptions count against quota
- **Custom Functions** - PostgreSQL functions needed for complex logic

### Risks

- **Free Tier Limits** - May exceed limits with growth
  - *Mitigation:* Monitor usage, optimize queries, budget for Pro plan ($25/month)

- **Service Outages** - Dependent on Supabase uptime
  - *Mitigation:* Regular backups, monitor status page, have migration plan

- **Vendor Lock-in** - Supabase-specific features hard to migrate
  - *Mitigation:* Use standard PostgreSQL features, avoid Supabase-only APIs where possible

- **Performance** - Shared infrastructure on free tier
  - *Mitigation:* Optimize queries, add indexes, upgrade to dedicated compute if needed

---

## Implementation

### Action Items

- [x] Create Supabase project
- [x] Set up development and production projects
- [x] Configure environment variables
- [x] Create database schema (migrations)
- [x] Enable Row-Level Security policies
- [x] Configure Supabase Auth settings
- [x] Set up API clients (@supabase/supabase-js)
- [x] Implement authentication flows
- [x] Create admin permissions system
- [x] Set up database backups

### Database Tables

```sql
-- Core tables
- profiles               # User profiles
- garage_sales          # Garage sale listings
- premium_sponsors      # Sponsor placements
- premium_pricing_plans # Pricing configuration
- knowledge_base        # Knowledge articles
- knowledge_categories  # Article categories
- user_permissions      # Admin permissions
- admin_activity_log    # Audit trail
- site_settings         # Configuration
- aurora_photos         # User-submitted photos
```

### Authentication Configuration

- **Email/Password:** Primary authentication method
- **Email Verification:** Required for new accounts
- **Password Requirements:** 8+ characters
- **Session Duration:** 1 hour (access token), 7 days (refresh token)
- **OAuth Providers:** Google (planned)

### Security Configuration

- Row-Level Security enabled on all tables
- Service role key stored securely in environment variables
- Anon key used for client-side operations
- JWT validation on all API routes

---

## Validation

### Success Criteria

- [x] Database queries < 100ms for typical operations
- [x] Authentication flows work smoothly
- [x] Zero data leaks between users (RLS working)
- [x] Backups configured and tested
- [x] All API routes authenticated properly

### Monitoring

- **Database Performance:** Query times, connection pool usage
- **Auth Metrics:** Login success rate, session duration
- **Usage Metrics:** MAU, storage, bandwidth
- **Cost Tracking:** Monitor usage against free tier limits

### Current Status (Jan 2025)

- Database size: 50MB / 500MB
- Monthly active users: 20 / 50,000
- API requests: ~5,000 / ~50,000
- Bandwidth: 2GB / 200GB
- **Status:** Well within free tier limits

---

## Migration Strategy

If we need to migrate away from Supabase:

1. **Database:** Export PostgreSQL dump, import to any PostgreSQL host
2. **Auth:** Migrate user table, re-issue password reset emails
3. **Storage:** Download files, upload to new storage service
4. **Code Changes:** Update Supabase client calls to new service

**Estimated Effort:** 1-2 weeks for full migration

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostGIS Extension](https://postgis.net/)

---

## Notes

### Decision History

- 2025-01-12: Evaluated backend options (Firebase, Supabase, AWS, self-hosted)
- 2025-01-14: Prototyped with Supabase
- 2025-01-16: Decision accepted
- 2025-01-18: Schema created, RLS policies implemented
- 2025-01-20: Authentication integrated

### Lessons Learned

1. **RLS is Powerful:** Database-level security better than application-level
2. **SQL Flexibility:** Full SQL access is amazing for complex queries
3. **Auth Just Works:** Supabase Auth saved weeks of development
4. **Cold Starts Rare:** Free tier cold starts not a real issue
5. **PostGIS is Great:** Geospatial queries simple with PostGIS

### Schema Evolution

- Started with 4 tables (profiles, garage_sales, sponsors, pricing)
- Added knowledge base (2 tables)
- Added admin system (3 tables)
- Added aurora photos (1 table)
- Current: 10 tables, well within limits

### Performance Notes

- Most queries < 50ms
- Geospatial queries < 100ms with proper indexes
- Connection pooling works well
- No performance issues at current scale

### Related Decisions

- [ADR-0004 - Row-Level Security](./0004-row-level-security.md)
- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)
- [ADR-0005 - Serverless Deployment](./0005-serverless-deployment.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Quarterly (especially monitoring costs and usage)
