-- ============================================
-- Adicionar coluna para guardar API keys no SiteConfig
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Adicionar coluna para a chave OpenRouter
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "openrouterApiKey" TEXT;

-- 2. Inserir a chave (substitua pela sua chave real)
UPDATE "SiteConfig" SET "openrouterApiKey" = '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'
WHERE id = (SELECT id FROM "SiteConfig" LIMIT 1);

-- Verificar
SELECT id, "openrouterApiKey" FROM "SiteConfig" LIMIT 1;
