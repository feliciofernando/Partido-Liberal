-- Inserir notícias de exemplo no Partido Liberal
-- Execute este script no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/aqqphaxvygqxkuyqcxee/sql/new

-- Inserir novas notícias (as imagens estão na pasta public/images/news/)
INSERT INTO "News" (id, title, slug, summary, content, image, category, published, featured, author, views, "createdAt", "updatedAt") VALUES
(
  gen_random_uuid(),
  'Partido Liberal apresenta Programa de Governo 2025-2030',
  'partido-liberal-apresenta-programa-de-governo-2025-2030',
  'Proposta inclui investimentos recordes em saúde, educação e infraestrutura para transformar Angola.',
  '<p>O Partido Liberal apresentou hoje o seu Programa de Governo para o período 2025-2030, num evento que contou com a presença de milhares de militantes e simpatizantes.</p><p>O documento prevê investimentos históricos em áreas prioritárias como saúde, educação, infraestrutura e economia, com foco na diversificação económica e geração de emprego.</p><p>"Este programa foi construído com base nas necessidades reais dos angolanos. Escutamos o povo e agora apresentamos soluções concretas", afirmou o Presidente do partido.</p><h3>Principais Eixos</h3><ul><li>Saúde: Construção de 50 novos hospitais provinciais</li><li>Educação: 100 novas escolas e reforma curricular</li><li>Infraestrutura: 5.000 km de estradas pavimentadas</li><li>Economia: Criação de 500 mil empregos formais</li></ul>',
  '/images/news/political-rally.png',
  'politica',
  true,
  true,
  'Redação PL',
  2847,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Programa de Saúde Materno-Infantil é expandido para todas as províncias',
  'programa-de-saude-materno-infantil-expandido',
  'Iniciativa prevê construção de maternidades modernas e formação de profissionais especializados.',
  '<p>O Partido Liberal anunciou a expansão do Programa de Saúde Materno-Infantil para todas as 18 províncias de Angola, como parte do compromisso com a qualidade de vida das famílias angolanas.</p><p>O programa inclui a construção de maternidades modernas equipadas com tecnologia de ponta, bem como a formação de médicos e enfermeiros especializados em saúde materna e pediatria.</p><p>"Cada mãe angolana merece ter acesso a atendimento de qualidade. Este programa vai salvar vidas", garantiu a responsável pela área de saúde do partido.</p>',
  '/images/news/healthcare-program.png',
  'social',
  true,
  false,
  'Nossa Equipe',
  1523,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Revolução Educativa: Partido Liberal propõe escola gratuita e de qualidade',
  'revolucao-educativa-escola-gratuita',
  'Proposta inclui reforma curricular, formação de professores e investimento em tecnologia educativa.',
  '<p>A educação é um dos pilares fundamentais do programa do Partido Liberal. A proposta prevê uma transformação completa do sistema educativo angolano.</p><p>Entre as medidas está a garantia de ensino gratuito e de qualidade desde a primária até à universidade, com foco na formação de cidadãos preparados para os desafios do século XXI.</p><p>"A educação é o motor do desenvolvimento. Sem educação de qualidade, não há futuro sustentável", defendeu o coordenador da área de educação.</p>',
  '/images/news/education-initiative.png',
  'politica',
  true,
  false,
  'Assessoria de Imprensa',
  1892,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Programa de Emprego Jovem vai criar 200 mil oportunidades em dois anos',
  'programa-emprego-jovem-200-mil',
  'Iniciativa foca em empreendedorismo, formação profissional e parcerias com empresas privadas.',
  '<p>O Partido Liberal lançou o Programa de Emprego Jovem, uma iniciativa ambiciosa que visa criar 200 mil oportunidades de emprego para jovens angolanos num período de dois anos.</p><p>O programa combina formação profissional, apoio ao empreendedorismo e parcerias estratégicas com o sector privado para garantir oportunidades reais de trabalho.</p><p>"Os jovens são o futuro de Angola. Precisamos dar-lhes as ferramentas para construir esse futuro", afirmou o responsável pela pasta da juventude.</p>',
  '/images/news/youth-empowerment.png',
  'economia',
  true,
  false,
  'Redação PL',
  2156,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Plano de Infraestrutura prevê investimentos de 50 mil milhões de kwanzas',
  'plano-infraestrutura-50-mil-milhoes',
  'Programa inclui estradas, pontes, energia elétrica e água potável para todas as comunidades.',
  '<p>O Partido Liberal apresentou o seu ambicioso Plano Nacional de Infraestrutura, que prevê investimentos de 50 mil milhões de kwanzas nos próximos cinco anos.</p><p>O plano abrange todas as províncias do país, com foco especial nas zonas rurais mais carenciadas de infraestruturas básicas.</p><p>"Não podemos aceitar que em pleno século XXI ainda existam angolanos sem acesso a água potável e energia elétrica", declarou o coordenador das infraestruturas.</p>',
  '/images/news/infrastructure-project.png',
  'economia',
  true,
  false,
  'Secretaria-Geral',
  1438,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Partido Liberal realiza encontro comunitário em Benguela',
  'encontro-comunitario-benguela',
  'Evento reuniu mais de 5.000 pessoas para discutir propostas para a província.',
  '<p>Mais de 5.000 pessoas participaram do encontro comunitário organizado pelo Partido Liberal na província de Benguela, num evento marcado por grande entusiasmo e participação popular.</p><p>Os líderes do partido apresentaram as propostas específicas para a província, incluindo investimentos no porto de Lobito, reabilitação de estradas e apoio à pesca artesanal.</p><p>"Benguela tem um potencial extraordinário. Vamos transformar essa província num exemplo de desenvolvimento", prometeu o coordenador provincial.</p>',
  '/images/news/community-event.png',
  'social',
  true,
  false,
  'Delegação de Benguela',
  987,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Coletiva de Imprensa: Partido Liberal apresenta equipe técnica',
  'coletiva-imprensa-equipe-tecnica',
  'Especialistas de diversas áreas integram equipe que vai liderar a transformação do país.',
  '<p>Em coletiva de imprensa realizada hoje, o Partido Liberal apresentou a sua equipe técnica, composta por especialistas de diversas áreas que vão liderar a transformação do país.</p><p>A equipe inclui economistas, médicos, engenheiros e educadores com experiência reconhecida, tanto em Angola como no exterior.</p><p>"Montamos uma equipe de excelência. São angolanos comprometidos com o futuro do nosso país", afirmou o Presidente do partido durante a apresentação.</p>',
  '/images/news/press-conference.png',
  'imprensa',
  true,
  false,
  'Assessoria de Comunicação',
  1256,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Programa de Apoio à Agricultura Familiar vai beneficiar 100 mil famílias',
  'programa-agricultura-familiar-100-mil',
  'Iniciativa inclui financiamento, formação técnica e acesso a mercados para pequenos produtores.',
  '<p>O Partido Liberal lançou o Programa de Apoio à Agricultura Familiar, uma iniciativa que vai beneficiar directamente 100 mil famílias de pequenos produtores em todo o país.</p><p>O programa prevê financiamento acessível, formação técnica, distribuição de sementes e equipamentos, bem como apoio na comercialização dos produtos.</p><p>"A agricultura familiar é a base da segurança alimentar. Vamos dar condições para que os nossos agricultores produzam mais e melhor", garantiu o coordenador da área rural.</p>',
  '/images/news/agriculture-support.png',
  'economia',
  true,
  false,
  'Redação PL',
  1678,
  NOW(),
  NOW()
);

-- Verificar inserções
SELECT title, category, featured, views FROM "News" ORDER BY "createdAt" DESC;
