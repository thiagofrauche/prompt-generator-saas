-- =====================================================
-- CRIAR USUÁRIO ADMINISTRADOR NO SUPABASE
-- =====================================================
-- Este script cria um usuário admin com credenciais fixas
-- 
-- CREDENCIAIS DE ACESSO ADMIN:
-- Email: admin@amoraai.com
-- Senha: AmoraAdmin2024!@#
-- 
-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard
-- =====================================================

-- Primeiro, vamos atualizar a tabela profiles para incluir a coluna is_admin
alter table public.profiles 
add column if not exists is_admin boolean default false;

-- Criar índice para busca rápida de admins
create index if not exists profiles_is_admin_idx on public.profiles(is_admin) where is_admin = true;

-- Atualizar políticas RLS para admins usando a coluna is_admin
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
drop policy if exists "profiles_delete_admin" on public.profiles;

-- Nova política: Admin pode ver todos os perfis
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Nova política: Admin pode atualizar qualquer perfil
create policy "profiles_update_admin"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Nova política: Admin pode deletar qualquer perfil
create policy "profiles_delete_admin"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- =====================================================
-- INSTRUÇÕES PARA CRIAR O USUÁRIO ADMIN:
-- =====================================================
-- 1. Vá para Authentication > Users no Supabase Dashboard
-- 2. Clique em "Add user" > "Create new user"
-- 3. Preencha:
--    - Email: admin@amoraai.com
--    - Password: AmoraAdmin2024!@#
--    - Auto Confirm User: YES (marque esta opção)
-- 4. Clique em "Create user"
-- 5. Copie o UUID do usuário criado
-- 6. Execute o comando abaixo substituindo 'USER_UUID_AQUI' pelo UUID copiado:

/*
-- SUBSTITUA 'USER_UUID_AQUI' pelo UUID do usuário criado
update public.profiles
set 
  is_admin = true,
  payment_status = 'paid',
  full_name = 'Administrador AMORA',
  payment_expires_at = '2099-12-31'::timestamp
where id = 'USER_UUID_AQUI';
*/

-- OU, se preferir criar o perfil diretamente (APÓS criar o usuário no Auth):
/*
-- SUBSTITUA 'USER_UUID_AQUI' pelo UUID do usuário criado
insert into public.profiles (id, email, full_name, payment_status, payment_expires_at, is_admin)
values (
  'USER_UUID_AQUI',
  'admin@amoraai.com',
  'Administrador AMORA',
  'paid',
  '2099-12-31'::timestamp,
  true
)
on conflict (id) do update
set 
  is_admin = true,
  payment_status = 'paid',
  full_name = 'Administrador AMORA',
  payment_expires_at = '2099-12-31'::timestamp;
*/

-- =====================================================
-- VERIFICAR SE O ADMIN FOI CRIADO CORRETAMENTE:
-- =====================================================
-- Execute esta query para verificar:
/*
select 
  id,
  email,
  full_name,
  is_admin,
  payment_status,
  payment_expires_at,
  created_at
from public.profiles
where email = 'admin@amoraai.com';
*/
