-- ============================================
-- EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- ============================================
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em SQL Editor
-- 4. Cole todo este código e clique em RUN
-- ============================================

-- Notícias
CREATE TABLE IF NOT EXISTS "News" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "summary" TEXT NOT NULL DEFAULT '',
  "content" TEXT NOT NULL DEFAULT '',
  "image" TEXT,
  "category" TEXT NOT NULL DEFAULT 'politica',
  "featured" BOOLEAN DEFAULT false,
  "published" BOOLEAN DEFAULT false,
  "author" TEXT,
  "views" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Líderes
CREATE TABLE IF NOT EXISTS "Leader" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "role" TEXT NOT NULL DEFAULT '',
  "province" TEXT,
  "bio" TEXT NOT NULL DEFAULT '',
  "photo" TEXT,
  "proposals" TEXT,
  "socialFacebook" TEXT,
  "socialTwitter" TEXT,
  "socialInstagram" TEXT,
  "socialLinkedin" TEXT,
  "order" INTEGER DEFAULT 0,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Eventos
CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "location" TEXT NOT NULL DEFAULT '',
  "province" TEXT NOT NULL DEFAULT '',
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "time" TEXT,
  "image" TEXT,
  "type" TEXT NOT NULL DEFAULT 'outro',
  "status" TEXT DEFAULT 'agendado',
  "attendees" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Event Leaders
CREATE TABLE IF NOT EXISTS "EventLeader" (
  "eventId" TEXT NOT NULL,
  "leaderId" TEXT NOT NULL,
  PRIMARY KEY ("eventId", "leaderId")
);

-- Event Confirmations
CREATE TABLE IF NOT EXISTS "EventConfirmation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Programa de Governo
CREATE TABLE IF NOT EXISTS "GovernmentProgram" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "area" TEXT NOT NULL DEFAULT '',
  "summary" TEXT NOT NULL DEFAULT '',
  "content" TEXT NOT NULL DEFAULT '',
  "icon" TEXT,
  "order" INTEGER DEFAULT 0,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Voluntários
CREATE TABLE IF NOT EXISTS "Volunteer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT NOT NULL DEFAULT '',
  "province" TEXT NOT NULL DEFAULT '',
  "municipality" TEXT,
  "availability" TEXT,
  "interests" TEXT,
  "experience" TEXT,
  "isFiscal" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'pendente',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Denúncias
CREATE TABLE IF NOT EXISTS "Complaint" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL DEFAULT '',
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "province" TEXT,
  "subject" TEXT NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "anonymous" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'pendente',
  "response" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Kit Digital
CREATE TABLE IF NOT EXISTS "KitItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL DEFAULT '',
  "fileUrl" TEXT NOT NULL DEFAULT '',
  "thumbnail" TEXT,
  "downloads" INTEGER DEFAULT 0,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Alertas
CREATE TABLE IF NOT EXISTS "Alert" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL DEFAULT 'info',
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Subscritores
CREATE TABLE IF NOT EXISTS "Subscriber" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Resultados Eleitorais
CREATE TABLE IF NOT EXISTS "ElectionResult" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "province" TEXT NOT NULL DEFAULT '',
  "municipality" TEXT,
  "votes" INTEGER DEFAULT 0,
  "percentage" FLOAT DEFAULT 0,
  "source" TEXT DEFAULT 'fiscal',
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Estatísticas
CREATE TABLE IF NOT EXISTS "SiteStats" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "totalVolunteers" INTEGER DEFAULT 0,
  "totalEvents" INTEGER DEFAULT 0,
  "totalNews" INTEGER DEFAULT 0,
  "totalLeaders" INTEGER DEFAULT 0,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Configurações
CREATE TABLE IF NOT EXISTS "SiteConfig" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" TEXT UNIQUE NOT NULL,
  "value" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS "News_category_idx" ON "News"("category");
CREATE INDEX IF NOT EXISTS "News_published_idx" ON "News"("published");
CREATE INDEX IF NOT EXISTS "Leader_active_idx" ON "Leader"("active");
CREATE INDEX IF NOT EXISTS "Event_date_idx" ON "Event"("date");
CREATE INDEX IF NOT EXISTS "Volunteer_status_idx" ON "Volunteer"("status");
CREATE INDEX IF NOT EXISTS "Complaint_status_idx" ON "Complaint"("status");
CREATE INDEX IF NOT EXISTS "KitItem_active_idx" ON "KitItem"("active");
CREATE INDEX IF NOT EXISTS "Alert_active_idx" ON "Alert"("active");
CREATE INDEX IF NOT EXISTS "Subscriber_email_idx" ON "Subscriber"("email");

-- Mensagem de sucesso
SELECT 'Tabelas criadas com sucesso!' AS message;
