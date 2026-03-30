-- =============================================
-- PARTIDO LIBERAL - CRIAR USUÁRIO ADMIN
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Criar tabela de administradores (se não existir)
CREATE TABLE IF NOT EXISTS "AdminUser" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS "AdminUser_email_idx" ON "AdminUser"(email);
CREATE INDEX IF NOT EXISTS "AdminUser_active_idx" ON "AdminUser"(active);

-- 3. ATIVAR Row Level Security (RLS)
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas existentes (para evitar duplicação)
DROP POLICY IF EXISTS "Service role full access" ON "AdminUser";
DROP POLICY IF EXISTS "Service role only" ON "AdminUser";

-- 5. Criar política para permitir acesso via Service Role (API do backend)
-- O backend usa SUPABASE_SERVICE_ROLE_KEY que tem acesso total
CREATE POLICY "Service role full access" ON "AdminUser"
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. Inserir o usuário admin principal
-- Senha: 946788879Gh!! (hash SHA-256)
INSERT INTO "AdminUser" (email, password_hash, name, role, active)
VALUES (
  'feliciofernando567@gmail.com',
  '3c627364ebba2a31d61ea2ece59fe5f5194006f6a727b2d3a2dbc5503edd75cb',
  'Felicio Fernando',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  active = EXCLUDED.active,
  "updatedAt" = NOW();

-- 7. Verificar se o admin foi criado
SELECT email, name, role, active, "createdAt" FROM "AdminUser" WHERE email = 'feliciofernando567@gmail.com';

-- Mensagem de sucesso
SELECT '✅ Usuário Admin criado com sucesso! RLS ativado.' as status;
