-- PARTIDO LIBERAL - COPIE E COLE NO SUPABASE SQL EDITOR
-- Link: https://supabase.com/dashboard/project/aqqphaxvygqxkuyqcxee/sql/new

-- TABELAS
CREATE TABLE IF NOT EXISTS "News" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    author TEXT,
    views INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Leader" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    province TEXT,
    bio TEXT NOT NULL,
    photo TEXT,
    proposals TEXT,
    "socialFacebook" TEXT,
    "socialTwitter" TEXT,
    "socialInstagram" TEXT,
    "socialLinkedin" TEXT,
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Event" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    province TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    time TEXT,
    image TEXT,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'agendado',
    attendees INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "EventLeader" (
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    "leaderId" TEXT NOT NULL REFERENCES "Leader"(id) ON DELETE CASCADE,
    PRIMARY KEY ("eventId", "leaderId")
);

CREATE TABLE IF NOT EXISTS "EventConfirmation" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "GovernmentProgram" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    area TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Volunteer" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    municipality TEXT,
    availability TEXT,
    interests TEXT,
    experience TEXT,
    "isFiscal" BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pendente',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Complaint" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    province TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    anonymous BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pendente',
    response TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "KitItem" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    thumbnail TEXT,
    downloads INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Alert" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Subscriber" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- DESATIVAR RLS
ALTER TABLE "News" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Leader" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "EventLeader" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "EventConfirmation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "GovernmentProgram" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Volunteer" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Complaint" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "KitItem" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Alert" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscriber" DISABLE ROW LEVEL SECURITY;

-- DADOS INICIAIS

INSERT INTO "Alert" (title, message, type, active) VALUES
('Grande Comício em Luanda', 'Não perca o lançamento da campanha em Luanda no dia 20 de Fevereiro!', 'urgente', true);

INSERT INTO "Leader" (name, slug, role, province, bio, "order") VALUES
('Dr. António Mendes', 'antonio-mendes', 'Presidente do Partido', 'Luanda', 'Líder experiente com mais de 20 anos de dedicação à política angolana. Economista formado pela Universidade de Lisboa.', 1),
('Dra. Maria Santos', 'maria-santos', 'Vice-Presidente', 'Benguela', 'Advogada e ativista dos direitos humanos. Pioneira na luta pela igualdade de género em Angola.', 2),
('Eng. João Silva', 'joao-silva', 'Secretário-Geral', 'Huambo', 'Engenheiro civil com vasta experiência em projetos de infraestrutura.', 3),
('Dr. Pedro Neto', 'pedro-neto', 'Candidato a Deputado', 'Lunda Sul', 'Médico comunitário dedicado à saúde rural.', 4),
('Dra. Ana Costa', 'ana-costa', 'Candidata a Deputada', 'Cabinda', 'Professora universitária e especialista em educação.', 5),
('Lic. Carlos Ferreira', 'carlos-ferreira', 'Secretário de Juventude', 'Huíla', 'Jovem líder estudantil e empreendedor.', 6);

INSERT INTO "News" (title, slug, summary, content, category, featured, published, author) VALUES
('Partido Liberal lança programa de governo para 2024-2029', 'programa-governo-2024-2029', 'Propostas incluem investimentos massivos em saúde, educação e infraestrutura.', 'O Partido Liberal apresentou hoje o seu programa de governo para o período 2024-2029, com propostas ambiciosas para transformar Angola.', 'comunicado', true, true, 'Redação PL'),
('Comício em Saurimo reúne mais de 10 mil pessoas', 'comicio-saurimo-10-mil', 'Evento marcou o lançamento da campanha na província da Lunda Sul.', 'Mais de 10 mil pessoas participaram do comício do Partido Liberal em Saurimo.', 'imprensa', false, true, 'Nossa Equipe'),
('Partido Liberal condena violência política', 'condena-violencia-politica', 'Nota oficial repudia atos de intolerância.', 'O Partido Liberal vem a público condenar veementemente todos os atos de violência política.', 'nota_oficial', false, true, 'Secretaria-Geral'),
('Candidatos do PL participam de debate televisivo', 'debate-televisivo-candidatos', 'Representantes apresentaram propostas.', 'Os candidatos do Partido Liberal participaram de um debate televisivo.', 'imprensa', false, true, 'Assessoria de Imprensa');

INSERT INTO "Event" (title, slug, description, location, province, date, time, type, status) VALUES
('Grande Comício em Luanda', 'comicio-luanda-2024', 'Lançamento oficial da campanha eleitoral.', 'Praça da Independência, Luanda', 'Luanda', '2025-02-20', '09:00', 'comicio', 'agendado'),
('Encontro com Jovens Empreendedores', 'encontro-jovens-empreendedores', 'Discussão sobre políticas de apoio ao empreendedorismo.', 'Centro de Conferências, Benguela', 'Benguela', '2025-02-22', '14:00', 'encontro', 'agendado'),
('Passeata pela Paz', 'passeata-paz-huambo', 'Caminhada pacífica em defesa da democracia.', 'Avenida Principal, Huambo', 'Huambo', '2025-02-25', '07:00', 'passeata', 'agendado'),
('Reunião de Fiscais', 'reuniao-fiscais-saurimo', 'Capacitação para fiscais de mesa.', 'Sede do Partido, Saurimo', 'Lunda Sul', '2025-02-18', '10:00', 'reuniao', 'agendado'),
('Comício em Cabinda', 'comicio-cabinda-2024', 'Apresentação das propostas para Cabinda.', 'Estádio Municipal, Cabinda', 'Cabinda', '2025-02-28', '16:00', 'comicio', 'agendado');

INSERT INTO "GovernmentProgram" (title, slug, area, summary, content, "order") VALUES
('Saúde', 'saude', 'Saúde', 'Investimentos massivos em hospitais e saúde.', 'Construção de 50 novos hospitais provinciais; Contratação de 20.000 profissionais de saúde; Programa de saúde materno-infantil ampliado', 1),
('Educação', 'educacao', 'Educação', 'Educação de qualidade para todos.', 'Escolas gratuitas em todas as comunidades; Reforma curricular com foco em tecnologia; Bolsas de estudo para alunos meritórios', 2),
('Economia', 'economia', 'Economia', 'Diversificação econômica e empregos.', 'Redução de impostos para pequenas empresas; Programa de microcrédito acessível; Incentivo à agricultura familiar', 3),
('Infraestrutura', 'infraestrutura', 'Infraestrutura', 'Estradas, energia e habitação.', 'Pavimentação de 5.000 km de estradas; Eletrificação rural em todas as províncias; Programa de habitação social', 4);

INSERT INTO "KitItem" (title, description, type, "fileUrl", downloads) VALUES
('Avatar Oficial PL', 'Foto de perfil para redes sociais.', 'avatar', '/kit/avatar-pl.png', 5420),
('Pack de Stickers WhatsApp', 'Figurinhas para usar no WhatsApp.', 'sticker', '/kit/stickers-pl.zip', 8230),
('Banner Facebook', 'Capa para perfil do Facebook.', 'banner', '/kit/banner-facebook.png', 3150),
('Programa de Governo PDF', 'PDF completo com todas as propostas.', 'documento', '/kit/programa-governo.pdf', 4890);
