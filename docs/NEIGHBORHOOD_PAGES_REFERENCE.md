# Neighborhood Pages Reference

This document provides an overview of all neighborhood-related pages in the YK-Companion app.

## Page Structure

```
apps/web/src/app/neighborhoods/
├── page.tsx                              # Main neighborhoods index
├── [slug]/
│   ├── page.tsx                         # Neighborhood dashboard (verified members only)
│   └── verify/
│       └── page.tsx                     # Verification form
├── alerts/
│   └── create/
│       └── page.tsx                     # Create new alert
└── verification-pending/
    └── page.tsx                         # Post-submission status page

apps/web/src/app/admin/neighborhoods/
└── verification/
    └── page.tsx                         # Admin verification dashboard
```

---

## User-Facing Pages

### 1. Neighborhoods Index (`/neighborhoods`)

**Component:** `NeighborhoodSelection.tsx`

**Purpose:** Browse and select your neighborhood

**Features:**
- Interactive map view
- Search by address
- List of all Yellowknife neighborhoods
- Member counts and feature previews
- Direct links to verification

**Access:** Public (anyone can view)

**User Flow:**
```
User visits → Browses neighborhoods → Selects neighborhood → Clicks "Join" → Redirected to verification
```

---

### 2. Neighborhood Dashboard (`/neighborhoods/[slug]`)

**Component:** `NeighborhoodDashboard.tsx`

**Purpose:** Main hub for verified neighborhood members

**Features:**
- **Alerts Tab**: Active safety alerts, crime watch, lost pets
- **Posts Tab**: Community bulletin board
- **Members Tab**: Neighborhood directory (coming soon)
- **Resources Tab**: Shared tools, equipment, services
- **Sidebar**: Upcoming events, stats, emergency contacts

**Access:** Verified neighborhood members only

**Protection:**
- Checks authentication
- Verifies neighborhood membership
- Redirects to verification if not verified

**User Flow:**
```
Verified member visits → Sees dashboard → Can view/create alerts, posts, resources
Non-verified visits → Sees "Verification Required" screen → Redirected to verify page
```

**Example URLs:**
- `/neighborhoods/range-lake`
- `/neighborhoods/old-town`
- `/neighborhoods/niven-lake`

---

### 3. Neighborhood Verification (`/neighborhoods/[slug]/verify`)

**Component:** `VerificationForm.tsx`

**Purpose:** Submit verification request to join a neighborhood

**Features:**
- **Step 1:** Address information (street address, move-in date, homeowner/renter)
- **Step 2:** Document upload OR neighbor vouching
- **Step 3:** Privacy settings (directory visibility, notifications)

**Access:** Authenticated users only

**User Flow:**
```
User clicks "Join Neighborhood" → Fills out 3-step form → Submits → Redirected to pending page
```

**Example URLs:**
- `/neighborhoods/range-lake/verify`
- `/neighborhoods/old-town/verify`

---

### 4. Verification Pending (`/neighborhoods/verification-pending`)

**Component:** Custom page

**Purpose:** Confirmation page after verification submission

**Features:**
- Success animation
- Timeline of what happens next
- Current status badge
- Tips while waiting
- Links to other areas

**Access:** Public (typically visited after form submission)

**User Flow:**
```
User submits verification → Sees success message → Understands next steps → Returns to explore other features
```

---

### 5. Create Alert (`/neighborhoods/alerts/create`)

**Component:** `AlertCreateForm.tsx`

**Purpose:** Create safety alerts for your neighborhood

**Features:**
- 7 alert types (crime, suspicious, lost pet, found item, emergency, power outage, road closure)
- Severity levels (low, medium, high, urgent)
- Location picker
- Photo upload (up to 4 images)
- Real-time preview

**Access:** Verified neighborhood members only

**Protection:**
- Checks authentication
- Verifies neighborhood membership
- Redirects non-verified users

**User Flow:**
```
Verified member clicks "Create Alert" → Selects type → Fills details → Uploads photos → Submits → Returns to dashboard
```

---

## Admin Pages

### 6. Admin Verification Dashboard (`/admin/neighborhoods/verification`)

**Component:** `AdminVerificationDashboard.tsx`

**Purpose:** Review and approve neighborhood verification requests

**Features:**
- Pending verification queue
- Filter by neighborhood
- Sort by oldest/newest
- Document viewer modal
- Approve/Reject/Request Info actions
- Red flag detection
- Vouching system review
- Activity analysis

**Access:** Admins only (checks `profile.is_admin`)

**Protection:**
- Checks authentication
- Verifies admin status
- Redirects non-admins to home

**User Flow:**
```
Admin logs in → Views pending requests → Clicks request → Reviews documents → Takes action (approve/reject/request info)
```

**Actions Available:**
- ✅ **Approve**: Grants user access to neighborhood features
- ❓ **Request More Info**: Sends message asking for additional verification
- ❌ **Reject**: Denies request with reason (user can reapply later)
- 📄 **View Documents**: Opens modal with uploaded verification documents

---

## Mock Data & Testing

All pages currently use mock data for demonstration purposes:

### Mock Neighborhoods
```typescript
{
  'range-lake': { name: 'Range Lake', icon: '🏡', memberCount: 134 },
  'old-town': { name: 'Old Town', icon: '🏛️', memberCount: 87 },
  'niven-lake': { name: 'Niven Lake', icon: '🌲', memberCount: 112 },
  'downtown': { name: 'Downtown', icon: '🏢', memberCount: 56 },
  'kam-lake': { name: 'Kam Lake', icon: '🏭', memberCount: 43 },
  'yellowknife-bay': { name: 'Yellowknife Bay', icon: '⚓', memberCount: 29 },
}
```

### Testing URLs

**Public Pages:**
- http://localhost:3002/neighborhoods
- http://localhost:3002/neighborhoods/verification-pending

**Authenticated Pages (require login):**
- http://localhost:3002/neighborhoods/range-lake/verify
- http://localhost:3002/neighborhoods/old-town/verify

**Verified Member Pages (require verification):**
- http://localhost:3002/neighborhoods/range-lake
- http://localhost:3002/neighborhoods/old-town
- http://localhost:3002/neighborhoods/alerts/create

**Admin Pages (require admin access):**
- http://localhost:3002/admin/neighborhoods/verification

---

## Integration Checklist

To connect these pages to real data, implement:

### Database Tables
- [ ] `neighborhoods`
- [ ] `neighborhood_members`
- [ ] `verification_requests`
- [ ] `neighborhood_alerts`
- [ ] `neighborhood_posts`
- [ ] `neighborhood_resources`
- [ ] `neighborhood_vouches`

### API Routes
- [ ] `GET /api/neighborhoods` - List all neighborhoods
- [ ] `GET /api/neighborhoods/[id]` - Get neighborhood details
- [ ] `POST /api/neighborhoods/verify` - Submit verification request
- [ ] `GET /api/neighborhoods/[id]/members` - Check membership status
- [ ] `GET /api/neighborhoods/[id]/alerts` - Get alerts
- [ ] `POST /api/neighborhoods/[id]/alerts` - Create alert
- [ ] `GET /api/admin/verification-requests` - List pending requests
- [ ] `POST /api/admin/verification-requests/[id]/approve` - Approve request
- [ ] `POST /api/admin/verification-requests/[id]/reject` - Reject request

### Authentication Hooks
- [ ] Check if user is authenticated
- [ ] Check if user is verified in neighborhood
- [ ] Check if user is admin
- [ ] Redirect unauthorized users

### File Upload
- [ ] Configure Supabase Storage for verification documents
- [ ] Set up RLS policies for document access
- [ ] Implement document auto-deletion after 90 days

---

## Navigation Updates Needed

Add to main navigation:

**Header Menu:**
```tsx
{ href: '/neighborhoods', label: 'Neighborhoods', icon: '🏘️' }
```

**User Dropdown (if verified):**
```tsx
{ href: '/neighborhoods/range-lake', label: 'My Neighborhood', icon: '🏡' }
```

**Admin Menu:**
```tsx
{ href: '/admin/neighborhoods/verification', label: 'Verify Members', icon: '✓' }
```

---

## Next Steps

1. **Implement Database Schema**
   - Run migrations from `NEIGHBORHOOD_VERIFICATION_SYSTEM_PLAN.md`
   - Set up RLS policies

2. **Create API Routes**
   - Follow patterns in existing `/api` directory
   - Add Zod validation schemas

3. **Connect Components to APIs**
   - Replace mock data with real API calls
   - Add loading states and error handling

4. **Add to Navigation**
   - Update Header component
   - Add menu items for neighborhoods

5. **Test User Flows**
   - Sign up → Select neighborhood → Submit verification → Get approved → Access dashboard
   - Create alerts, posts, share resources

6. **Deploy & Launch**
   - Test in staging environment
   - Pilot with 1-2 neighborhoods
   - Gather feedback and iterate

---

## Design Patterns Used

All pages follow consistent patterns:

**Authentication Check:**
```tsx
const { user, profile, loading } = useAuth();

if (!user) {
  router.push('/auth/login');
  return;
}
```

**Loading State:**
```tsx
if (loading) {
  return <LoadingSpinner />;
}
```

**Authorization Gate:**
```tsx
if (!isVerified) {
  return <VerificationRequiredScreen />;
}
```

**Aurora Theme:**
- Gradient backgrounds: `from-northern-midnight via-dark-900`
- Glassmorphic cards: `backdrop-blur-xl bg-dark-900/95`
- Aurora colors: `aurora-green`, `aurora-blue`, `aurora-purple`, `aurora-pink`
- Smooth animations: `animate-in fade-in slide-in-from-bottom`

---

## Accessibility Features

All pages include:
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Sufficient color contrast (WCAG AA)
- Mobile-friendly touch targets (44px minimum)

---

**Last Updated:** 2025-10-29
**Version:** 1.0
**Status:** Ready for API integration
