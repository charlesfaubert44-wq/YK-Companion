-- YK Buddy Admin & Permissions Schema Enhancement
-- Run this AFTER the main supabase-schema.sql
-- This adds admin functionality and granular permissions

-- ============================================
-- 1. Add admin field to profiles table
-- ============================================
alter table public.profiles
  add column if not exists is_admin boolean default false not null,
  add column if not exists address text;

-- Create index for faster admin lookups
create index if not exists idx_profiles_is_admin on public.profiles(is_admin) where is_admin = true;

-- ============================================
-- 2. User Permissions Table (Granular Control)
-- ============================================
create table if not exists public.user_permissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null unique,

  -- Permission flags
  is_super_admin boolean default false not null,
  can_manage_users boolean default false not null,
  can_manage_sponsors boolean default false not null,
  can_manage_content boolean default false not null,
  can_manage_garage_sales boolean default false not null,
  can_view_analytics boolean default false not null,
  can_manage_settings boolean default false not null,

  -- Metadata
  notes text,
  granted_by uuid references public.profiles,
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast permission lookups
create index if not exists idx_user_permissions_user_id on public.user_permissions(user_id);

-- ============================================
-- 3. Admin Activity Log Table
-- ============================================
create table if not exists public.admin_activity_log (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles on delete set null,
  action text not null,
  target_type text, -- 'user', 'content', 'sponsor', etc.
  target_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for querying logs
create index if not exists idx_admin_log_admin_id on public.admin_activity_log(admin_id);
create index if not exists idx_admin_log_created_at on public.admin_activity_log(created_at desc);
create index if not exists idx_admin_log_action on public.admin_activity_log(action);

-- ============================================
-- 4. Enable Row Level Security
-- ============================================
alter table public.user_permissions enable row level security;
alter table public.admin_activity_log enable row level security;

-- ============================================
-- 5. RLS Policies for user_permissions
-- ============================================

-- Only admins can view permissions
create policy "Admins can view all permissions"
  on public.user_permissions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Only super admins can insert permissions
create policy "Super admins can grant permissions"
  on public.user_permissions for insert
  with check (
    exists (
      select 1 from public.user_permissions up
      join public.profiles p on p.id = up.user_id
      where p.id = auth.uid()
      and up.is_super_admin = true
    )
  );

-- Only super admins can update permissions
create policy "Super admins can update permissions"
  on public.user_permissions for update
  using (
    exists (
      select 1 from public.user_permissions up
      join public.profiles p on p.id = up.user_id
      where p.id = auth.uid()
      and up.is_super_admin = true
    )
  );

-- Only super admins can delete permissions
create policy "Super admins can revoke permissions"
  on public.user_permissions for delete
  using (
    exists (
      select 1 from public.user_permissions up
      join public.profiles p on p.id = up.user_id
      where p.id = auth.uid()
      and up.is_super_admin = true
    )
  );

-- ============================================
-- 6. RLS Policies for admin_activity_log
-- ============================================

-- Admins can view all logs
create policy "Admins can view activity logs"
  on public.admin_activity_log for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- System can insert logs (using service role)
create policy "Service role can insert logs"
  on public.admin_activity_log for insert
  with check (true);

-- ============================================
-- 7. Update profiles RLS to allow admin access
-- ============================================

-- Drop existing policy if it exists and recreate
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    true -- Already public, but this makes intent clear
  );

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    auth.uid() = id -- Own profile
    or
    exists ( -- Or is admin
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- ============================================
-- 8. Helper Functions
-- ============================================

-- Function to check if a user is an admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id
    and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Function to check specific permission
create or replace function public.has_permission(
  user_id uuid,
  permission_name text
)
returns boolean as $$
declare
  result boolean;
begin
  -- First check if user is admin
  if not exists (select 1 from public.profiles where id = user_id and is_admin = true) then
    return false;
  end if;

  -- Then check specific permission
  execute format(
    'select (is_super_admin or %I) from public.user_permissions where user_id = $1',
    permission_name
  ) into result using user_id;

  return coalesce(result, false);
end;
$$ language plpgsql security definer;

-- Function to log admin activity
create or replace function public.log_admin_activity(
  p_action text,
  p_target_type text default null,
  p_target_id text default null,
  p_details jsonb default null
)
returns uuid as $$
declare
  log_id uuid;
begin
  insert into public.admin_activity_log (
    admin_id,
    action,
    target_type,
    target_id,
    details
  ) values (
    auth.uid(),
    p_action,
    p_target_type,
    p_target_id,
    p_details
  ) returning id into log_id;

  return log_id;
end;
$$ language plpgsql security definer;

-- Update the handle_new_user function to support admin flag
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, address, is_admin)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'address',
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false)
  );

  insert into public.user_preferences (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add updated_at trigger for user_permissions
drop trigger if exists handle_user_permissions_updated_at on public.user_permissions;
create trigger handle_user_permissions_updated_at
  before update on public.user_permissions
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- 9. Grant necessary permissions
-- ============================================

-- Grant usage on tables
grant usage on schema public to anon, authenticated;
grant all on public.user_permissions to authenticated;
grant all on public.admin_activity_log to authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

-- ============================================
-- 10. Create first admin user (IMPORTANT!)
-- ============================================

-- INSTRUCTIONS: After running this schema, run the following separately
-- Replace 'YOUR_USER_EMAIL@example.com' with your actual email

-- First, sign up via the app with your email
-- Then run this SQL to make yourself an admin:

/*
-- Make user an admin
update public.profiles
set is_admin = true
where email = 'YOUR_USER_EMAIL@example.com';

-- Grant super admin permissions
insert into public.user_permissions (
  user_id,
  is_super_admin,
  can_manage_users,
  can_manage_sponsors,
  can_manage_content,
  can_manage_garage_sales,
  can_view_analytics,
  can_manage_settings
)
select
  id,
  true,
  true,
  true,
  true,
  true,
  true,
  true
from public.profiles
where email = 'YOUR_USER_EMAIL@example.com'
on conflict (user_id) do update set
  is_super_admin = true,
  can_manage_users = true,
  can_manage_sponsors = true,
  can_manage_content = true,
  can_manage_garage_sales = true,
  can_view_analytics = true,
  can_manage_settings = true;
*/
