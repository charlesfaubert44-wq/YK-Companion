-- YK Buddy Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  user_type text check (user_type in ('visiting', 'living', 'moving')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Preferences Table
create table public.user_preferences (
  id uuid references public.profiles on delete cascade primary key,

  -- Common preferences
  interests text[],
  budget_range text check (budget_range in ('budget', 'moderate', 'luxury')),
  preferred_activities text[],

  -- Visiting-specific
  trip_start_date date,
  trip_end_date date,
  group_size integer,
  accommodation_type text,
  has_vehicle boolean default false,

  -- Living-specific
  favorite_neighborhoods text[],
  event_notifications boolean default true,

  -- Moving-specific
  target_move_date date,
  housing_budget_max integer,
  job_search_active boolean default false,
  preferred_job_sectors text[],

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved Items (favorites, bookmarks)
create table public.saved_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  item_type text check (item_type in ('activity', 'event', 'accommodation', 'job', 'housing')) not null,
  item_id text not null,
  item_data jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Itineraries (for visitors)
create table public.itineraries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  description text,
  start_date date,
  end_date date,
  items jsonb, -- Array of activities/events with dates/times
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_items enable row level security;
alter table public.itineraries enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for user_preferences
create policy "Users can view own preferences."
  on public.user_preferences for select
  using (auth.uid() = id);

create policy "Users can insert own preferences."
  on public.user_preferences for insert
  with check (auth.uid() = id);

create policy "Users can update own preferences."
  on public.user_preferences for update
  using (auth.uid() = id);

-- RLS Policies for saved_items
create policy "Users can view own saved items."
  on public.saved_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved items."
  on public.saved_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved items."
  on public.saved_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own saved items."
  on public.saved_items for delete
  using (auth.uid() = user_id);

-- RLS Policies for itineraries
create policy "Users can view own itineraries."
  on public.itineraries for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can insert own itineraries."
  on public.itineraries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own itineraries."
  on public.itineraries for update
  using (auth.uid() = user_id);

create policy "Users can delete own itineraries."
  on public.itineraries for delete
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  insert into public.user_preferences (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_preferences_updated_at
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();

create trigger handle_itineraries_updated_at
  before update on public.itineraries
  for each row execute procedure public.handle_updated_at();

-- Indexes for better performance
create index idx_saved_items_user_id on public.saved_items(user_id);
create index idx_saved_items_type on public.saved_items(item_type);
create index idx_itineraries_user_id on public.itineraries(user_id);
create index idx_itineraries_public on public.itineraries(is_public) where is_public = true;
