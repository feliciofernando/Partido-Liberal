-- =============================================
-- GUIA DE GERENCIAMENTO DE ADMINISTRADORES
-- Execute no SQL Editor do Supabase
-- =============================================

-- ==========================================
-- ESTRUTURA DA TABELA COM RLS ATIVADO
-- ==========================================

-- Verificar se a tabela existe e sua estrutura:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'AdminUser';

-- Verificar se RLS está ativado:
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'AdminUser';

-- Verificar políticas RLS existentes:
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'AdminUser';

-- ==========================================
-- COMO ADICIONAR UM NOVO ADMIN
-- ==========================================

-- Para adicionar um novo admin, primeiro calcule o hash SHA-256 da senha:
-- No terminal Linux/Mac: echo -n 'sua_senha' | sha256sum

-- Depois execute (como service_role no backend ou via SQL Editor):
INSERT INTO "AdminUser" (email, password_hash, name, role, active)
VALUES (
  'novo_admin@email.com',           -- Email do novo admin
  'hash_sha256_da_senha_aqui',      -- Hash SHA-256 da senha
  'Nome do Admin',                   -- Nome completo
  'admin',                           -- Role (sempre 'admin')
  true                               -- Active (true = ativo)
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  active = EXCLUDED.active,
  "updatedAt" = NOW();

-- ==========================================
-- CALCULAR HASH SHA-256 DA SENHA
-- ==========================================

-- No terminal Linux/Mac:
-- echo -n 'sua_senha_aqui' | sha256sum

-- No PowerShell Windows:
-- $sha256 = [System.Security.Cryptography.SHA256]::Create();
-- $bytes = [System.Text.Encoding]::UTF8.GetBytes('sua_senha_aqui');
-- $hash = $sha256.ComputeHash($bytes);
-- [System.BitConverter]::ToString($hash).Replace('-', '').ToLower();

-- Online (use com cautela):
-- https://emn178.github.io/online-tools/sha256.html

-- ==========================================
-- LISTAR TODOS OS ADMINS
-- ==========================================
SELECT
  email,
  name,
  role,
  active,
  "createdAt",
  "updatedAt"
FROM "AdminUser"
ORDER BY "createdAt" DESC;

-- ==========================================
-- DESATIVAR UM ADMIN (manter registro)
-- ==========================================
UPDATE "AdminUser"
SET active = false, "updatedAt" = NOW()
WHERE email = 'admin@email.com';

-- ==========================================
-- REATIVAR UM ADMIN
-- ==========================================
UPDATE "AdminUser"
SET active = true, "updatedAt" = NOW()
WHERE email = 'admin@email.com';

-- ==========================================
-- ALTERAR SENHA DE UM ADMIN
-- ==========================================
-- Primeiro calcule o novo hash, depois:
UPDATE "AdminUser"
SET password_hash = 'novo_hash_sha256', "updatedAt" = NOW()
WHERE email = 'admin@email.com';

-- ==========================================
-- REMOVER UM ADMIN PERMANENTEMENTE
-- ==========================================
DELETE FROM "AdminUser" WHERE email = 'admin@email.com';

-- ==========================================
-- RE-CRIAR POLÍTICA RLS (SE NECESSÁRIO)
-- ==========================================

-- Se precisar recriar as políticas RLS:
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Service role full access" ON "AdminUser";

-- Criar política para service role (backend API)
CREATE POLICY "Service role full access" ON "AdminUser"
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ==========================================
-- NOTA IMPORTANTE SOBRE RLS
-- ==========================================

/*
O RLS está ATIVADO e funciona assim:

1. O backend (Next.js API) usa SUPABASE_SERVICE_ROLE_KEY
   - Esta chave tem role = 'service_role'
   - A política permite TODAS as operações para service_role

2. Usuários anônimos ou autenticados via Supabase Auth
   - NÃO têm acesso direto à tabela AdminUser
   - Tudo passa pelo backend API que usa service_role

3. SQL Editor do Supabase
   - Executa como superuser, bypassando RLS
   - Pode fazer qualquer operação

Isto garante que:
- Credenciais não ficam expostas no frontend
- Apenas o backend pode verificar senhas
- Você pode gerenciar admins via SQL Editor
*/
