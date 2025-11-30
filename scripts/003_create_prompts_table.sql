-- Create table to store generated prompts for each user
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  generated_prompt text not null,
  answers jsonb not null,
  attached_files jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.prompts enable row level security;

-- Users can only view their own prompts
create policy "prompts_select_own"
  on public.prompts for select
  using (auth.uid() = user_id);

-- Users can only insert their own prompts
create policy "prompts_insert_own"
  on public.prompts for insert
  with check (auth.uid() = user_id);

-- Users can only update their own prompts
create policy "prompts_update_own"
  on public.prompts for update
  using (auth.uid() = user_id);

-- Users can only delete their own prompts
create policy "prompts_delete_own"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- Admin can view all prompts
create policy "prompts_select_admin"
  on public.prompts for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for faster queries
create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_created_at_idx on public.prompts(created_at desc);
