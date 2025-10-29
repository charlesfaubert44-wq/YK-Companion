-- =====================================================
-- CHECK VISITOR LOGBOOK STATUS
-- =====================================================
-- Run this to see what's already been created

-- Check if tables exist
SELECT
  table_name,
  'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('visitor_logbook', 'visitor_logbook_likes');

-- Check if indexes exist
SELECT
  indexname,
  'EXISTS' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE '%logbook%';

-- Check if functions exist
SELECT
  routine_name,
  'EXISTS' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%logbook%';

-- Check if RLS policies exist
SELECT
  tablename,
  policyname,
  'EXISTS' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('visitor_logbook', 'visitor_logbook_likes');

-- Count existing entries
SELECT
  'visitor_logbook' as table_name,
  COUNT(*) as row_count
FROM visitor_logbook
UNION ALL
SELECT
  'visitor_logbook_likes' as table_name,
  COUNT(*) as row_count
FROM visitor_logbook_likes;
