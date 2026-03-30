-- SQL para criar as tabelas no Supabase
-- Execute este SQL no SQL Editor do Supabase

-- Notícias
CREATE TABLE IF NOT EXISTS "News" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "summary" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "image" TEXT,
  "category" TEXT NOT NULL,
  "featured" BOOLEAN DEFAULT false,
  "published" BOOLEAN DEFAULT false,
  "author" TEXT,
  "views" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "News_category_idx" ON "News"("category");
CREATE INDEX IF NOT EXISTS "News_published_idx" ON "News"("published");
CREATE INDEX IF NOT EXISTS "News_createdAt_idx" ON "News"("createdAt");

-- Líderes
CREATE TABLE IF NOT EXISTS "Leader" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "role" TEXT NOT NULL,
  "province" TEXT,
  "bio" TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS "Leader_active_idx" ON "Leader"("active");
CREATE INDEX IF NOT EXISTS "Leader_order_idx" ON "Leader"("order");

-- Eventos
CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "time" TEXT,
  "image" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT DEFAULT 'agendado',
  "attendees" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Event_date_idx" ON "Event"("date");
CREATE INDEX IF NOT EXISTS "Event_province_idx" ON "Event"("province");
CREATE INDEX IF NOT EXISTS "Event_status_idx" ON "Event"("status");

-- Event Leaders (relação)
CREATE TABLE IF NOT EXISTS "EventLeader" (
  "eventId" TEXT NOT NULL REFERENCES "Event"("id") ON DELETE CASCADE,
  "leaderId" TEXT NOT NULL REFERENCES "Leader"("id") ON DELETE CASCADE,
  PRIMARY KEY ("eventId", "leaderId")
);

-- Event Confirmations
CREATE TABLE IF NOT EXISTS "EventConfirmation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" TEXT NOT NULL REFERENCES "Event"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "EventConfirmation_eventId_idx" ON "EventConfirmation"("eventId");

-- Programa de Governo
CREATE TABLE IF NOT EXISTS "GovernmentProgram" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "area" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "icon" TEXT,
  "order" INTEGER DEFAULT 0,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "GovernmentProgram_active_idx" ON "GovernmentProgram"("active");
CREATE INDEX IF NOT EXISTS "GovernmentProgram_order_idx" ON "GovernmentProgram"("order");

-- Voluntários
CREATE TABLE IF NOT EXISTS "Volunteer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "municipality" TEXT,
  "availability" TEXT,
  "interests" TEXT,
  "experience" TEXT,
  "isFiscal" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'pendente',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Volunteer_status_idx" ON "Volunteer"("status");
CREATE INDEX IF NOT EXISTS "Volunteer_province_idx" ON "Volunteer"("province");

-- Denúncias
CREATE TABLE IF NOT EXISTS "Complaint" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "province" TEXT,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "anonymous" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'pendente',
  "response" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Complaint_status_idx" ON "Complaint"("status");
CREATE INDEX IF NOT EXISTS "Complaint_type_idx" ON "Complaint"("type");

-- Kit Digital
CREATE TABLE IF NOT EXISTS "KitItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "thumbnail" TEXT,
  "downloads" INTEGER DEFAULT 0,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "KitItem_active_idx" ON "KitItem"("active");
CREATE INDEX IF NOT EXISTS "KitItem_type_idx" ON "KitItem"("type");

-- Alertas
CREATE TABLE IF NOT EXISTS "Alert" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Alert_active_idx" ON "Alert"("active");

-- Subscritores
CREATE TABLE IF NOT EXISTS "Subscriber" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Subscriber_email_idx" ON "Subscriber"("email");
CREATE INDEX IF NOT EXISTS "Subscriber_active_idx" ON "Subscriber"("active");

-- Resultados Eleitorais
CREATE TABLE IF NOT EXISTS "ElectionResult" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "province" TEXT NOT NULL,
  "municipality" TEXT,
  "votes" INTEGER DEFAULT 0,
  "percentage" FLOAT DEFAULT 0,
  "source" TEXT DEFAULT 'fiscal',
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "ElectionResult_province_idx" ON "ElectionResult"("province");

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
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
