# Visitor Logbook Feature - Complete Documentation

## Overview

The Visitor Logbook is an interactive community feature that allows visitors to Yellowknife to share their experiences with photos and stories. These posts are displayed throughout the website, creating a beautiful and engaging user experience.

## Features

### Core Functionality
- **Photo Uploads**: Multiple photos per entry (up to 10 photos, 10MB each)
- **Rich Text Stories**: Share detailed experiences with title, message, and metadata
- **Experience Tagging**: Categorize by experience type (aurora, hiking, culture, food, etc.)
- **Rating System**: 5-star rating for overall experience
- **Like/Heart System**: Authenticated users can like entries
- **View Tracking**: Automatic view counting
- **Moderation System**: Admin approval required before entries go live
- **Featured Entries**: Admins can feature exceptional stories
- **Filtering & Search**: Filter by experience type, rating, featured status
- **Responsive Design**: Beautiful on all devices

### Display Locations
- **Dedicated Page**: `/visiting/logbook` - Full logbook with filters
- **Home Page**: Recent featured entries widget
- **Visiting Page**: Featured stories widget
- **Extensible**: Widget can be added to any page

## Architecture

### Database Schema

**Main Table**: `visitor_logbook`
```sql
- id (UUID)
- user_id (UUID) - References auth.users
- visitor_name (TEXT) - Visitor's name
- visitor_location (TEXT) - Where they're from
- title (TEXT) - Entry title
- message (TEXT) - Detailed experience
- photos (TEXT[]) - Array of photo URLs
- featured_photo (TEXT) - Main display photo
- visit_date (DATE) - When they visited
- visit_duration (TEXT) - How long they stayed
- experience_type (TEXT[]) - Categories
- rating (INTEGER 1-5) - Overall rating
- likes_count (INTEGER) - Number of likes
- views_count (INTEGER) - View count
- is_approved (BOOLEAN) - Admin approval status
- is_featured (BOOLEAN) - Featured flag
- is_active (BOOLEAN) - Soft delete
- created_at, updated_at
```

**Likes Table**: `visitor_logbook_likes`
```sql
- id (UUID)
- entry_id (UUID) - References visitor_logbook
- user_id (UUID) - References auth.users
- created_at
- UNIQUE constraint on (entry_id, user_id)
```

### File Structure

```
apps/web/src/
├── app/
│   ├── api/
│   │   └── visitor-logbook/
│   │       ├── route.ts                    # GET (list), POST (create)
│   │       ├── upload/route.ts             # POST (photo upload)
│   │       └── [id]/
│   │           ├── route.ts                # GET, PUT, DELETE (single entry)
│   │           └── like/route.ts           # POST (toggle like)
│   └── visiting/
│       └── logbook/
│           └── page.tsx                     # Main logbook page
│
├── components/
│   └── visitor-logbook/
│       ├── AddLogbookEntryModal.tsx        # Entry creation modal
│       ├── LogbookEntryCard.tsx            # Individual entry display
│       ├── LogbookGrid.tsx                 # Grid of entries
│       └── RecentLogbookWidget.tsx         # Embeddable widget
│
├── hooks/
│   └── useVisitorLogbook.ts                # Data fetching hook
│
└── types/
    └── visitor-logbook.types.ts            # TypeScript definitions

supabase/
├── migrations/
│   └── 20250128000000_visitor_logbook.sql  # Database migration
└── STORAGE_BUCKET_SETUP.md                 # Storage setup guide
```

## Setup Instructions

### 1. Database Setup

Run the migration:
```bash
# The migration file is already created at:
# supabase/migrations/20250128000000_visitor_logbook.sql

# Apply it using Supabase CLI:
supabase db push
```

### 2. Storage Bucket Setup

**IMPORTANT**: You must manually create the storage bucket in Supabase Dashboard.

1. Go to **Supabase Dashboard** → **Storage**
2. Click **Create a new bucket**
3. Configure:
   - **Name**: `visitor-logbook-photos`
   - **Public**: ✅ Yes
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/heic`

4. Add RLS policies in **SQL Editor**:

```sql
-- Anyone can view photos
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'visitor-logbook-photos');

-- Authenticated users can upload photos
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'visitor-logbook-photos'
    AND auth.role() = 'authenticated'
  );

-- Users can delete their own photos
CREATE POLICY "Users Delete Own Photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'visitor-logbook-photos'
    AND auth.uid() = owner
  );
```

See detailed instructions: [supabase/STORAGE_BUCKET_SETUP.md](supabase/STORAGE_BUCKET_SETUP.md)

### 3. Environment Variables

No additional environment variables needed! The feature uses existing Supabase configuration.

### 4. Next.js Configuration

Ensure your `next.config.js` allows Supabase images:

```javascript
images: {
  domains: [
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
  ],
}
```

## Usage Guide

### For Visitors (Users)

1. **Creating an Entry**:
   - Sign in to YK Buddy
   - Navigate to `/visiting/logbook`
   - Click "Share Your Experience"
   - Fill in the form:
     - Personal info (name, location)
     - Visit details (date, duration)
     - Title and message
     - Upload photos (1-10)
     - Select experience types
     - Rate your visit (1-5 stars)
   - Submit for approval

2. **Viewing Entries**:
   - Browse at `/visiting/logbook`
   - Filter by experience type, rating, or featured status
   - Like entries (requires sign-in)
   - View full photo galleries

### For Admins

**Approving Entries**: (Future admin panel feature)
```sql
-- Approve an entry
UPDATE visitor_logbook
SET is_approved = true
WHERE id = '<entry-id>';

-- Feature an entry
UPDATE visitor_logbook
SET is_featured = true
WHERE id = '<entry-id>';
```

**Managing Entries**:
```sql
-- View pending entries
SELECT * FROM visitor_logbook
WHERE is_approved = false
ORDER BY created_at DESC;

-- Soft delete inappropriate content
UPDATE visitor_logbook
SET is_active = false, moderation_notes = 'Reason for removal'
WHERE id = '<entry-id>';
```

## API Endpoints

### GET `/api/visitor-logbook`
Fetch entries with filtering

**Query Parameters**:
- `featured` (boolean) - Show only featured entries
- `experience_type` (string) - Filter by experience type
- `rating` (number) - Minimum rating (1-5)
- `limit` (number) - Results per page (default: 20)
- `offset` (number) - Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [/* array of entries */],
  "total": 42
}
```

### POST `/api/visitor-logbook`
Create a new entry (requires authentication)

**Request Body**:
```json
{
  "visitor_name": "John Doe",
  "visitor_location": "Toronto, ON",
  "title": "Amazing Northern Lights!",
  "message": "Detailed experience...",
  "visit_date": "2025-01-15",
  "visit_duration": "1 week",
  "experience_type": ["aurora", "culture"],
  "rating": 5,
  "photos": ["https://...url1", "https://...url2"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {/* created entry */},
  "message": "Your entry has been submitted and is pending approval!"
}
```

### POST `/api/visitor-logbook/upload`
Upload a photo (requires authentication)

**Request**: `multipart/form-data` with `photo` field

**Response**:
```json
{
  "success": true,
  "url": "https://...public-url",
  "path": "logbook/user-id-timestamp.jpg"
}
```

### POST `/api/visitor-logbook/[id]/like`
Toggle like status (requires authentication)

**Response**:
```json
{
  "success": true,
  "liked": true,
  "likes_count": 42
}
```

### GET/PUT/DELETE `/api/visitor-logbook/[id]`
Individual entry operations

## Components

### AddLogbookEntryModal
```tsx
import AddLogbookEntryModal from '@/components/visitor-logbook/AddLogbookEntryModal';

<AddLogbookEntryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {/* refresh data */}}
/>
```

### LogbookGrid
```tsx
import LogbookGrid from '@/components/visitor-logbook/LogbookGrid';

<LogbookGrid
  featured={true}
  experienceType="aurora"
  rating={4}
  limit={12}
  compact={false}
/>
```

### RecentLogbookWidget
```tsx
import RecentLogbookWidget from '@/components/visitor-logbook/RecentLogbookWidget';

<RecentLogbookWidget
  limit={3}
  featured={true}
  compact={true}
  showViewAll={true}
/>
```

### LogbookEntryCard
```tsx
import LogbookEntryCard from '@/components/visitor-logbook/LogbookEntryCard';

<LogbookEntryCard
  entry={entry}
  onLike={handleLike}
  compact={false}
/>
```

## Custom Hook

### useVisitorLogbook
```tsx
import { useVisitorLogbook } from '@/hooks/useVisitorLogbook';

const {
  entries,           // Array of entries
  loading,           // Loading state
  error,             // Error message
  total,             // Total count
  hasMore,           // More entries available
  fetchEntries,      // Manual fetch function
  loadMore,          // Load next page
  refresh,           // Refresh current data
  toggleLike,        // Like/unlike function
  createEntry,       // Create new entry
  deleteEntry,       // Delete entry
} = useVisitorLogbook({
  autoFetch: true,
  featured: false,
  experienceType: 'aurora',
  rating: 4,
  limit: 20,
});
```

## Security Features

### Rate Limiting
- **Photo Uploads**: 20 uploads per minute per user
- **Entry Creation**: 10 entries per hour per user
- **API Reads**: 30 requests per minute

### Input Validation
- All inputs validated with Zod schemas
- File type and size restrictions
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping

### Row Level Security (RLS)
- Users can only edit/delete their own entries
- Unapproved entries only visible to owner
- Admins have full access
- Public can view approved entries only

### Moderation
- All entries require admin approval
- Soft delete system (is_active flag)
- Moderation notes for internal tracking

## Experience Types

Available categories:
- ✨ **aurora** - Northern Lights
- 🥾 **hiking** - Hiking & Nature
- 🏛️ **culture** - Culture & History
- 🍽️ **food** - Food & Dining
- 🦌 **wildlife** - Wildlife
- 📸 **photography** - Photography
- ❄️ **winter-activities** - Winter Activities
- ☀️ **summer-activities** - Summer Activities
- 🎉 **local-events** - Local Events
- 🛍️ **shopping** - Shopping
- 🌟 **other** - Other

## Customization

### Adding to New Pages

```tsx
import RecentLogbookWidget from '@/components/visitor-logbook/RecentLogbookWidget';

// In your page component
<div className="my-page">
  {/* Your content */}

  <RecentLogbookWidget
    limit={5}
    featured={false}
    compact={true}
  />
</div>
```

### Styling

The feature uses Tailwind CSS with the app's existing design system:
- **Colors**: aurora-green, aurora-blue, aurora-purple, dark-* scale
- **Responsive**: Mobile-first design
- **Dark Theme**: Optimized for dark backgrounds
- **Animations**: Smooth transitions and hover effects

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] Storage bucket created and configured
- [ ] Can upload photos
- [ ] Can create entry (shows pending)
- [ ] Admin can approve entry
- [ ] Approved entries appear in list
- [ ] Can like/unlike entries
- [ ] View count increments
- [ ] Filters work correctly
- [ ] Widget displays on home page
- [ ] Widget displays on visiting page
- [ ] Mobile responsive
- [ ] Photo gallery works
- [ ] Rate limiting prevents abuse

## Future Enhancements

Potential additions:
- [ ] Admin dashboard for moderation
- [ ] Email notifications for approvals
- [ ] Social sharing buttons
- [ ] Map integration (show visit locations)
- [ ] Search functionality
- [ ] Comments/replies system
- [ ] Export entries as PDF
- [ ] Instagram integration
- [ ] Monthly highlights/featured collections

## Troubleshooting

### Photos not uploading
- Verify storage bucket exists and is public
- Check RLS policies on storage.objects
- Verify file size < 10MB
- Check file type is allowed

### Entries not appearing
- Check `is_approved = true` in database
- Check `is_active = true`
- Verify RLS policies

### Likes not working
- User must be authenticated
- Check visitor_logbook_likes table exists
- Verify triggers are created

### Widget not showing
- Check if there are approved entries
- Verify import path is correct
- Check console for errors

## Support

For issues or questions:
1. Check this documentation
2. Review migration file for RLS policies
3. Check Supabase logs
4. Review browser console for errors

## Credits

Built with:
- **Next.js 14** - React framework
- **Supabase** - Database & storage
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Zod** - Schema validation

---

**Last Updated**: January 28, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
