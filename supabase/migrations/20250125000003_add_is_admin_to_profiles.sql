-- Add is_admin column to profiles table
-- This enables super admin functionality across the platform

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Update RLS policies to allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Update RLS policies to allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Add RLS policies for admins to view all user preferences
DROP POLICY IF EXISTS "Admins can view all preferences" ON public.user_preferences;
CREATE POLICY "Admins can view all preferences"
  ON public.user_preferences FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Add RLS policies for admins to view all saved items
DROP POLICY IF EXISTS "Admins can view all saved items" ON public.saved_items;
CREATE POLICY "Admins can view all saved items"
  ON public.saved_items FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Add RLS policies for admins to view all itineraries
DROP POLICY IF EXISTS "Admins can view all itineraries" ON public.itineraries;
CREATE POLICY "Admins can view all itineraries"
  ON public.itineraries FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if the user has super admin privileges';
