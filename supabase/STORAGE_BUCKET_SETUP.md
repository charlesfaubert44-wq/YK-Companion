# Supabase Storage Bucket Setup

This document contains instructions for setting up storage buckets in Supabase Dashboard.

## Visitor Logbook Photos Bucket

### Create Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Configure:
   - **Bucket name**: `visitor-logbook-photos`
   - **Public bucket**: ✅ Yes (checked)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/heic`

### Storage Policies

After creating the bucket, add these RLS policies in the SQL Editor:

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

-- Users can update their own photos
CREATE POLICY "Users Update Own Photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'visitor-logbook-photos'
    AND auth.uid() = owner
  );
```

### Verify Setup

Test the bucket:

```typescript
// Upload test
const { data, error } = await supabase
  .storage
  .from('visitor-logbook-photos')
  .upload('test.jpg', file);

// Get public URL
const { data: { publicUrl } } = supabase
  .storage
  .from('visitor-logbook-photos')
  .getPublicUrl('test.jpg');
```

## Next.js Configuration

Ensure the Supabase domain is in `next.config.js`:

```javascript
images: {
  domains: [
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
  ],
}
```
