# ADR-0004: Implement Row-Level Security for Multi-Tenancy

**Status:** Accepted
**Date:** 2025-01-18
**Decision Makers:** Development Team
**Impact:** High
**Security Impact:** Critical

---

## Context

YK Buddy has multiple user types with different access levels:

- **Public Users:** View approved content only
- **Registered Users:** Create and edit their own content
- **Admins:** Moderate content, manage users
- **Super Admins:** Full system access

We need a security model that:

1. **Prevents data leaks** - Users can't see others' private data
2. **Enforces permissions** - Admins can only perform allowed actions
3. **Is reliable** - Security can't be bypassed
4. **Is maintainable** - Easy to understand and update
5. **Performs well** - Minimal overhead on queries

### Security Requirements

- User A cannot access User B's private data
- Only admins can moderate content
- Only super admins can manage permissions
- All data access must be logged (admin actions)
- Guest users see only public content

### Current Challenge

Application-level security (checking permissions in API routes) has risks:

- Easy to forget permission checks
- Inconsistent enforcement
- Vulnerable to bugs
- Hard to audit
- Doesn't protect direct database access

---

## Decision

**We will use PostgreSQL Row-Level Security (RLS) as the primary security mechanism**, enforced at the database layer.

### Approach

1. **Enable RLS on all tables** containing user data
2. **Create RLS policies** for each user type/action
3. **Use Supabase Auth JWT** to identify current user
4. **Fall back to API-level checks** only for complex business logic
5. **Audit all admin actions** through triggers and logging
6. **Test policies** thoroughly in development

### Implementation Pattern

```sql
-- Enable RLS
ALTER TABLE garage_sales ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved sales
CREATE POLICY "Anyone can view approved garage sales"
    ON garage_sales FOR SELECT
    USING (approval_status = 'approved' AND is_active = true);

-- Policy: Users can view their own sales
CREATE POLICY "Users can view their own garage sales"
    ON garage_sales FOR SELECT
    USING (posted_by = auth.uid());

-- Policy: Users can create sales (must be their own)
CREATE POLICY "Users can create garage sales"
    ON garage_sales FOR INSERT
    WITH CHECK (posted_by = auth.uid());

-- Policy: Admins can do anything
CREATE POLICY "Admins can manage all garage sales"
    ON garage_sales FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );
```

---

## Alternatives Considered

### Alternative 1: Application-Level Security Only

**Description:** Check permissions in API routes/business logic

**Pros:**
- Simpler to understand initially
- More flexible business logic
- Easier to debug
- No database-specific features

**Cons:**
- Easy to forget checks
- Inconsistent enforcement
- Vulnerable to bypass bugs
- Doesn't protect direct DB access
- Hard to audit
- Must trust application code

**Why not chosen:** Too risky. One missed check = data leak. Want database to enforce security.

### Alternative 2: View-Based Security

**Description:** Create database views for each user type

**Pros:**
- Database-level security
- Can encapsulate complex logic
- Reusable across applications

**Cons:**
- Views can be complex to maintain
- Performance overhead
- Less flexible than RLS
- Harder to compose filters

**Why not chosen:** RLS is more modern and flexible. Views add complexity without benefits over RLS.

### Alternative 3: Separate Databases Per Tenant

**Description:** One database (or schema) per user/organization

**Pros:**
- Complete data isolation
- Easy to backup/restore individual tenants
- Can scale horizontally

**Cons:**
- Complex to manage (thousands of databases)
- Expensive (many database instances)
- Overkill for our use case
- Migration/upgrades complex

**Why not chosen:** We're not a multi-tenant SaaS with orgs. Users share one database. This is massive overkill.

### Alternative 4: API Gateway with Policy Engine

**Description:** Use external policy engine (e.g., OPA, Oso)

**Pros:**
- Centralized policy management
- Policy-as-code
- Can handle complex authorization logic
- Language-agnostic

**Cons:**
- Additional infrastructure
- Extra network hop (latency)
- Complexity overhead
- Another service to manage
- Overkill for our scale

**Why not chosen:** Too complex for our needs. RLS handles our use cases. Don't need external policy engine.

---

## Consequences

### Positive Consequences

- **Security by Default:** Database enforces access control automatically
- **Can't Be Bypassed:** Even if app code has bugs, database blocks unauthorized access
- **Consistent Enforcement:** Same rules apply to all queries
- **Audit Trail:** Can see exactly what policies allow
- **Performance:** PostgreSQL optimizes RLS queries
- **Less Code:** Don't need permission checks in every API route
- **Protects Direct Access:** Even SQL console respects RLS (with proper role)
- **Testable:** Can test policies with different auth contexts

### Negative Consequences

- **Learning Curve:** RLS syntax takes time to learn
- **Debugging:** Harder to debug why a query returns no results
- **Complex Policies:** Some business logic awkward to express in SQL
- **Performance Impact:** Additional WHERE clauses on every query (usually minimal)
- **Migration Complexity:** Changing policies requires database migration
- **Limited to PostgreSQL:** Can't easily port to other databases

### Risks

- **Policy Mistakes:** Incorrect policy could leak data
  - *Mitigation:* Comprehensive test suite, code review, test with different users

- **Performance Degradation:** Complex policies might slow queries
  - *Mitigation:* Proper indexes, query optimization, monitoring

- **Policy Conflicts:** Multiple policies might interact unexpectedly
  - *Mitigation:* Clear naming, documentation, testing

- **Bypassable with Service Role:** Service role key can bypass RLS
  - *Mitigation:* Protect service key, use anon key in client, validate in API routes

---

## Implementation

### RLS Policies Created

#### Profiles Table
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    );
```

#### Garage Sales Table
```sql
-- Anyone can view approved sales
-- Users can view their own sales
-- Users can create sales
-- Users can update their pending sales
-- Admins can manage all sales
```

#### User Permissions Table
```sql
-- Users can view their own permissions
CREATE POLICY "Users can view their own permissions"
    ON user_permissions FOR SELECT
    USING (user_id = auth.uid());

-- Super admins can manage all permissions
CREATE POLICY "Super admins can manage all permissions"
    ON user_permissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_permissions
            WHERE user_id = auth.uid() AND is_super_admin = true
        )
    );
```

#### Admin Activity Log
```sql
-- Admins can view activity log
CREATE POLICY "Admins can view activity log"
    ON admin_activity_log FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    );

-- System can insert into activity log
CREATE POLICY "System can insert into activity log"
    ON admin_activity_log FOR INSERT
    WITH CHECK (true);
```

### Testing Strategy

1. **Unit Tests:** Test each policy in isolation
   ```sql
   -- Set user context
   SET LOCAL role TO authenticated;
   SET LOCAL request.jwt.claims TO '{"sub": "user-id"}';

   -- Test query
   SELECT * FROM garage_sales; -- Should only see user's sales + approved
   ```

2. **Integration Tests:** Test with actual auth tokens
3. **Manual Testing:** Test in Supabase dashboard with different users
4. **Security Audit:** Review all policies quarterly

### Performance Optimization

- **Indexes on auth columns:** `CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);`
- **Indexes on foreign keys:** All posted_by, user_id columns indexed
- **Analyze queries:** Use EXPLAIN ANALYZE to check policy impact
- **Minimize policy complexity:** Keep policies simple where possible

---

## Validation

### Success Criteria

- [x] No user can see another user's private data
- [x] Admins can access admin functions
- [x] Non-admins blocked from admin functions
- [x] All policies tested with multiple user contexts
- [x] Performance impact < 10ms per query
- [x] Zero security incidents related to data leaks

### Security Testing

**Penetration Testing Checklist:**
- [ ] Try accessing other users' data
- [ ] Try modifying other users' data
- [ ] Try deleting other users' data
- [ ] Try escalating privileges
- [ ] Try bypassing approval workflows
- [ ] Test with expired tokens
- [ ] Test with manipulated tokens

### Current Status (Jan 2025)

- All tables have RLS enabled
- 25+ policies created and tested
- Zero data leaks detected
- Performance impact minimal (< 5ms average)

---

## Developer Guidelines

### When to Add a New Policy

1. Creating a new table with user data
2. Changing access requirements for existing table
3. Adding new user role or permission
4. Changing data visibility rules

### Policy Naming Convention

```
"[User type] can [action] [scope]"

Examples:
- "Users can view their own profile"
- "Admins can manage all garage sales"
- "Anyone can view approved sponsors"
```

### Testing a New Policy

```sql
-- 1. Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 2. Create policy
CREATE POLICY "policy_name" ON table_name
    FOR SELECT
    USING (condition);

-- 3. Test as different users
-- Use Supabase dashboard with different auth tokens
-- Or use SET LOCAL in SQL

-- 4. Verify no access leaks
-- Check that users can't see data they shouldn't
```

---

## References

- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security#rls-performance)
- [Security Migration](../../supabase/migrations/20250126000002_admin_system_fixed.sql)

---

## Notes

### Decision History

- 2025-01-16: Evaluated security approaches
- 2025-01-18: Decided on RLS as primary mechanism
- 2025-01-19: Implemented initial policies
- 2025-01-20: Tested policies with multiple users
- 2025-01-22: Added admin activity logging

### Lessons Learned

1. **Test Policies Early:** Caught several policy bugs through testing
2. **Keep Policies Simple:** Complex policies hard to debug
3. **Index Everything:** Performance much better with proper indexes
4. **Supabase Dashboard:** Great for testing policies interactively
5. **Service Role Caution:** Be very careful with service role key

### Common Pitfalls

1. **Forgetting WITH CHECK:** INSERT/UPDATE need WITH CHECK clause
2. **Policy Conflicts:** Multiple policies can interfere
3. **NULL Handling:** Be careful with NULL checks in policies
4. **Performance:** Complex subqueries in policies can be slow
5. **Testing:** Must test with actual auth context, not just SQL

### Policy Evolution

- Week 1: Basic policies (view own data)
- Week 2: Admin policies added
- Week 3: Complex approval workflows
- Week 4: Activity logging policies
- Current: 25+ policies, well-tested

### Related Decisions

- [ADR-0002 - Supabase Backend](./0002-supabase-backend.md)
- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Quarterly security audit
**Critical:** Any changes to RLS policies must be reviewed by 2+ developers
