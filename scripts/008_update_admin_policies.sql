-- =====================================================
-- ATUALIZAR POLÍTICAS RLS PARA USAR is_admin
-- =====================================================

-- Primeiro, garantir que a coluna is_admin existe
alter table public.profiles 
add column if not exists is_admin boolean default false;

-- Criar índice para busca rápida de admins
create index if not exists profiles_is_admin_idx on public.profiles(is_admin) where is_admin = true;

-- Atualizar políticas da tabela prompts
drop policy if exists "prompts_select_admin" on public.prompts;
drop policy if exists "prompts_delete_admin" on public.prompts;

create policy "prompts_select_admin"
  on public.prompts for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "prompts_delete_admin"
  on public.prompts for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Atualizar políticas da tabela projects
drop policy if exists "projects_select_admin" on public.projects;
drop policy if exists "projects_delete_admin" on public.projects;

create policy "projects_select_admin"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "projects_delete_admin"
  on public.projects for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );
