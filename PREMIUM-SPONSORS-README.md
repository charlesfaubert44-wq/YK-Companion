# Premium Sponsors System - Implementation Guide

## Overview
A comprehensive premium sponsorship system for YK Buddy with placeholders, ad integration capability, and full admin management.

## Features Implemented

### 1. Premium Sponsors Display Component
**File:** `apps/web/src/components/sponsors/PremiumSponsors.tsx`

Features:
- Grid, list, and carousel layout options
- Three sponsor tiers: Basic, Premium, Enterprise
- Aurora-themed animations for premium tiers
- Automatic date-based activation/deactivation
- Responsive design with Tailwind CSS
- Placeholder when no sponsors exist
- Google AdSense integration capability

Usage:
```tsx
// Basic usage
<PremiumSponsors position="home_top" />

// With custom options
<PremiumSponsors
  position="home_middle"
  maxSponsors={6}
  layout="grid"
  showPlaceholder={true}
/>

// With ads
<PremiumSponsorsWithAds
  position="home_bottom"
  adSlot="1234567890"
  showAd={true}
/>
```

### 2. Admin Panel
**Files:**
- `apps/web/src/components/sponsors/SponsorAdmin.tsx` - Reusable admin component
- `apps/web/src/app/admin/sponsors/page.tsx` - Admin page (already existed)

Features:
- Create, edit, delete sponsors
- Automatic price calculation with volume discounts
- Position and plan type selection
- Date range management
- Payment status tracking
- Contact information management
- Toggle active/inactive status

Access: Navigate to `/admin/sponsors`

### 3. Sponsor Information Page
**File:** `apps/web/src/app/sponsor-info/page.tsx`

Features:
- Interactive pricing calculator
- Plan comparison (Basic, Premium, Enterprise)
- Position selection with multipliers
- Volume discount breakdown
- Benefits showcase
- Contact form link
- Responsive design

Access: Navigate to `/sponsor-info`

### 4. Database Schema
**File:** `supabase/migrations/20250124000003_premium_sponsors.sql` (already exists)

Tables:
- `premium_sponsors` - Stores sponsor listings
- `premium_pricing_plans` - Stores pricing tiers and configurations

### 5. Ad Integration
**Component:** `AdSenseSlot` in `PremiumSponsors.tsx`

Features:
- Google AdSense integration ready
- Placeholder for ad client ID
- Responsive ad units
- Automatic ad loading

Setup:
1. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense client ID
2. Set appropriate ad slots for each position
3. Include AdSense script in your app layout

## Sponsor Tiers

### Basic Plan
- Standard listing with name and tagline
- Clickable link to website
- Aurora blue theme
- Starting at $7-15/day depending on position

### Premium Plan
- Enhanced styling with aurora effects
- Priority placement
- Aurora purple theme
- Featured badge
- Starting at $15-20/day depending on position

### Enterprise Plan
- Maximum visibility
- Animated aurora backgrounds
- Gold/yellow theme
- Top priority placement
- Custom integration options
- Starting at $25-30/day depending on position

## Positions Available

1. **Home - Top** (2.0x multiplier) - Premium real estate
2. **Home - Middle** (1.5x multiplier) - Good visibility
3. **Home - Bottom** (1.0x multiplier) - Footer area
4. **Visiting Section** (1.7x multiplier) - Target tourists
5. **Living Section** (1.4x multiplier) - Target residents
6. **Moving Section** (1.6x multiplier) - Target newcomers

## Pricing Structure

Base prices with multipliers and volume discounts:
- 7+ days: 5-15% discount
- 30+ days: 15-25% discount
- 90+ days: 25-35% discount

Example calculation:
- Premium plan at Home Top position
- 30 days duration
- Base: $20/day × 2.0 multiplier = $40/day
- Subtotal: $40 × 30 = $1,200
- With 20% discount: $960 final price

## Integration Points

### Home Page
The premium sponsors section is integrated into the home page at:
- `apps/web/src/app/page.tsx`

Two sponsor sections:
1. Logged-in users: `home_middle` position (3 sponsors)
2. Non-logged-in users: `home_bottom` position (6 sponsors) with title

### Other Pages
You can add sponsor sections to other pages by importing and using:
```tsx
import PremiumSponsors from '@/components/sponsors/PremiumSponsors';

<PremiumSponsors position="visiting" maxSponsors={3} />
```

## CSS Animations

Aurora animations are already configured in:
- `apps/web/src/styles/globals.css`

Classes available:
- `.aurora-wave` - Base aurora wave
- `.aurora-green` - Green aurora effect
- `.aurora-blue` - Blue aurora effect
- `.aurora-purple` - Purple aurora effect
- `.animate-shimmer` - Shimmer effect for text

## Admin Workflow

### Adding a New Sponsor:
1. Navigate to `/admin/sponsors`
2. Click "New Sponsor"
3. Fill in sponsor details
4. Select position and plan type
5. Set duration and start date
6. System automatically calculates price
7. Click "Create Sponsor Listing"

### Managing Existing Sponsors:
- Toggle active/inactive status
- Edit sponsor details
- Delete sponsors
- View payment status
- Check date ranges

## Database Setup

The database migration already exists. To apply it:

```bash
# If using Supabase CLI
npx supabase db push

# Or apply manually via Supabase Dashboard:
# Go to SQL Editor and run the migration file
```

The migration creates:
- Tables with proper indexes
- Row Level Security (RLS) policies
- Default pricing plans for all positions
- Triggers for updated_at timestamps

## Future Enhancements

Potential additions:
1. **Analytics Dashboard**
   - Track impressions
   - Monitor clicks
   - Calculate ROI

2. **Payment Integration**
   - Stripe integration
   - Automated invoicing
   - Payment reminders

3. **Advanced Features**
   - A/B testing for sponsor positions
   - Custom logos/images
   - Video backgrounds
   - Social media integration

4. **Reporting**
   - Export sponsor data
   - Revenue reports
   - Performance metrics

## Placeholder Design

When no sponsors exist, a professional placeholder is shown:
- Building icon
- "Premium Sponsor Space Available" message
- Description of benefits
- "Become a Sponsor" CTA button
- Links to sponsor information page

## Contact Information

For sponsor inquiries, update the email in:
- `apps/web/src/app/sponsor-info/page.tsx` (line 287)
- Default: `sponsors@ykbuddy.com`

## Support

For technical issues or questions:
1. Check this documentation
2. Review component props and TypeScript interfaces
3. Check Supabase database structure
4. Review RLS policies if data isn't showing

## Notes

- All prices are in CAD
- Dates are stored in UTC with timezone
- Aurora animations work best on modern browsers
- Mobile responsive across all breakpoints
- AdSense requires approval and setup
- Admin access currently requires authentication (customize RLS policies for specific admin roles)
