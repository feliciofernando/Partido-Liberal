-- Script para popular o Kit Digital com imagens de capa
-- Execute no Supabase SQL Editor

-- Primeiro, limpar a tabela se necessário (opcional)
-- DELETE FROM "KitItem";

-- Inserir itens do kit com imagens de capa
INSERT INTO "KitItem" (id, title, description, type, "fileUrl", thumbnail, downloads, active, "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'Banner Campanha 2025',
    'Banner oficial para divulgação em redes sociais e materiais impressos. Formato horizontal ideal para Facebook, LinkedIn e impressão.',
    'banner',
    'https://partidoliberal.ao/kit/banner-campanha-2025.pdf',
    '/images/kit/banner-campanha.png',
    1250,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Avatar de Perfil Oficial',
    'Moldura circular para foto de perfil nas redes sociais. Mostre seu apoio ao Partido Liberal com estilo!',
    'avatar',
    'https://partidoliberal.ao/kit/avatar-perfil.png',
    '/images/kit/avatar-perfil.png',
    3420,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Flyer Comício Regional',
    'Panfleto para divulgação de eventos e comícios. Pronto para impressão em tamanho A5.',
    'flyer',
    'https://partidoliberal.ao/kit/flyer-comicio.pdf',
    '/images/kit/flyer-evento.png',
    890,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Stickers WhatsApp',
    'Pacote de stickers para WhatsApp com mensagens de apoio e símbolos do partido. Divirta-se compartilhando!',
    'sticker',
    'https://partidoliberal.ao/kit/stickers-whatsapp.zip',
    '/images/kit/sticker-whatsapp.png',
    5670,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Documento Programa de Governo',
    'Documento oficial com o programa de governo completo. PDF para download e compartilhamento.',
    'documento',
    'https://partidoliberal.ao/kit/programa-governo-2025.pdf',
    '/images/kit/documento-oficial.png',
    2150,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Banner Redes Sociais',
    'Banner quadrado otimizado para Instagram e Facebook. Design moderno com cores do partido.',
    'banner',
    'https://partidoliberal.ao/kit/banner-social.png',
    '/images/kit/banner-social.png',
    1890,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Apresentação Institucional',
    'Apresentação de slides com informações sobre o partido e suas propostas. Ideal para reuniões e eventos.',
    'apresentacao',
    'https://partidoliberal.ao/kit/apresentacao-institucional.pptx',
    '/images/kit/video-apresentacao.png',
    720,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Manual do Militante',
    'Guia completo com orientações para militantes sobre como divulgar o partido nas redes sociais e eventos.',
    'documento',
    'https://partidoliberal.ao/kit/manual-militante.pdf',
    '/images/kit/documento-oficial.png',
    980,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Verificar itens inseridos
SELECT title, type, downloads, active FROM "KitItem" ORDER BY downloads DESC;
