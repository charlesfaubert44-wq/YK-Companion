# Apply Visitor Logbook Migration

## Quick Steps to Push to Dev Database

### Option 1: Supabase SQL Editor (Recommended - Takes 2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your YK Buddy project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy & Run the Migration**
   - Open: `supabase/migrations/20250128000000_visitor_logbook.sql`
   - Copy ALL the SQL (lines 1-254)
   - Paste into the SQL Editor
   - Click **"Run"** button (or Ctrl+Enter)

4. **Verify Success**
   You should see:
   ```
   Success. No rows returned
   ```

   To verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%logbook%';
   ```

   Expected result:
   - visitor_logbook
   - visitor_logbook_likes

### Option 2: Link Supabase CLI and Push

If you want to use the CLI for future migrations:

```bash
# Get your project ref from Supabase Dashboard
# Settings → General → Project Reference ID: rffmraamxolnghrhvbfq

# Link the project
npx supabase link --project-ref rffmraamxolnghrhvbfq

# Enter your database password when prompted

# Push all pending migrations
npx supabase db push
```

## After Migration is Applied

### CRITICAL: Create Storage Bucket

**This MUST be done manually** - it cannot be done via SQL:

1. **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Configure:
   - **Bucket name**: `visitor-logbook-photos`
   - **Public bucket**: ✅ **Check this box**
   - Click **Create**

4. **Add Storage Policies** (run in SQL Editor):

```sql
-- Allow anyone to view photos
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'visitor-logbook-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'visitor-logbook-photos'
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own photos
CREATE POLICY "Users Delete Own Photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'visitor-logbook-photos'
    AND auth.uid() = owner
  );
```

### Test the Feature

1. **Start your dev server**:
   ```bash
   npm run dev:web
   ```

2. **Visit the logbook page**:
   ```
   http://localhost:3002/visiting/logbook
   ```

3. **Create a test entry**:
   - Sign in to your app
   - Click "Share Your Experience"
   - Fill in the form and upload photos
   - Submit

4. **Approve the entry** (temporary - until admin panel is built):
   ```sql
   -- Run in SQL Editor to approve all entries
   UPDATE visitor_logbook
   SET is_approved = true
   WHERE is_approved = false;
   ```

5. **View your entry**:
   - Refresh `/visiting/logbook`
   - Your entry should now appear!

## Troubleshooting

### Migration fails with "relation already exists"
The migration is already applied. You can check:
```sql
SELECT * FROM visitor_logbook LIMIT 1;
```

### Photos not uploading
- Make sure storage bucket `visitor-logbook-photos` exists
- Verify bucket is set to **Public**
- Check storage policies are applied

### Entries not showing
- Check `is_approved = true` in database
- Verify you're signed in
- Check browser console for errors

## Quick Reference

**Project URL**: https://rffmraamxolnghrhvbfq.supabase.co
**Migration File**: `supabase/migrations/20250128000000_visitor_logbook.sql`
**Feature Docs**: `VISITOR_LOGBOOK_FEATURE.md`
