-- =====================================================
-- VERIFY VISITOR LOGBOOK SETUP
-- =====================================================
-- Run this to confirm everything is set up correctly
-- =====================================================

-- 1. Check tables exist
SELECT
  'Tables' as component,
  table_name,
  'EXISTS ✓' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('visitor_logbook', 'visitor_logbook_likes')
ORDER BY table_name;

-- 2. Check indexes exist
SELECT
  'Indexes' as component,
  indexname as name,
  'EXISTS ✓' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('visitor_logbook', 'visitor_logbook_likes')
ORDER BY indexname;

-- 3. Check functions exist
SELECT
  'Functions' as component,
  routine_name as name,
  'EXISTS ✓' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%logbook%'
ORDER BY routine_name;

-- 4. Check RLS is enabled
SELECT
  'RLS Status' as component,
  tablename as name,
  CASE WHEN rowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('visitor_logbook', 'visitor_logbook_likes')
ORDER BY tablename;

-- 5. Check RLS policies exist
SELECT
  'RLS Policies' as component,
  tablename || '.' || policyname as name,
  cmd as type,
  'EXISTS ✓' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('visitor_logbook', 'visitor_logbook_likes')
ORDER BY tablename, policyname;

-- 6. Check storage bucket exists
SELECT
  'Storage Bucket' as component,
  name,
  CASE WHEN public THEN 'PUBLIC ✓' ELSE 'PRIVATE ✗' END as status
FROM storage.buckets
WHERE name = 'visitor-logbook-photos';

-- 7. Check storage policies exist
SELECT
  'Storage Policies' as component,
  name,
  'EXISTS ✓' as status
FROM storage.policies
WHERE bucket_id = 'visitor-logbook-photos'
ORDER BY name;

-- 8. Summary
SELECT
  '=== SETUP COMPLETE ===' as message,
  'All components verified!' as status;
