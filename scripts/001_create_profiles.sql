-- Create profiles table to store user information and payment status
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  payment_status text not null default 'pending',
  payment_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies for users to manage their own profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Admin policy to view all profiles (admin users can be identified by a specific role)
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin policy to update any profile (for payment status management)
create policy "profiles_update_admin"
  on public.profiles for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin policy to delete any profile (to remove non-paying customers)
create policy "profiles_delete_admin"
  on public.profiles for delete
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create index for faster lookups
create index if not exists profiles_payment_status_idx on public.profiles(payment_status);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);
