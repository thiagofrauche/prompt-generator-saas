-- Licenças
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  cakto_order_id text unique,
  cakto_product_id text,
  status text check (status in ('active','refunded','chargeback','cancelled')) default 'active',
  plan text,            -- 'mensal' | 'creditos'
  credits int default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Uso
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  action text,          -- 'generate_prompt'
  meta jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.licenses enable row level security;
create policy "users can see own licenses"
  on public.licenses for select
  using (auth.uid() = user_id);

alter table public.usage_logs enable row level security;
create policy "users can see own usage"
  on public.usage_logs for select
  using (auth.uid() = user_id);
