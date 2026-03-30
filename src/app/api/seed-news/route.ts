import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

const newsData = [
  {
    title: 'Partido Liberal apresenta Programa de Governo 2025-2030',
    summary: 'Proposta inclui investimentos recordes em saúde, educação e infraestrutura para transformar Angola.',
    content: `<p>O Partido Liberal apresentou hoje o seu Programa de Governo para o período 2025-2030, num evento que contou com a presença de milhares de militantes e simpatizantes.</p>
<p>O documento prevê investimentos históricos em áreas prioritárias como saúde, educação, infraestrutura e economia, com foco na diversificação económica e geração de emprego.</p>
<p>"Este programa foi construído com base nas necessidades reais dos angolanos. Escutamos o povo e agora apresentamos soluções concretas", afirmou o Presidente do partido.</p>
<h3>Principais Eixos</h3>
<ul>
<li>Saúde: Construção de 50 novos hospitais provinciais</li>
<li>Educação: 100 novas escolas e reforma curricular</li>
<li>Infraestrutura: 5.000 km de estradas pavimentadas</li>
<li>Economia: Criação de 500 mil empregos formais</li>
</ul>`,
    category: 'politica',
    image: '/images/news/political-rally.png',
    featured: true,
    author: 'Redação PL',
    views: 2847
  },
  {
    title: 'Programa de Saúde Materno-Infantil é expandido para todas as províncias',
    summary: 'Iniciativa prevê construção de maternidades modernas e formação de profissionais especializados.',
    content: `<p>O Partido Liberal anunciou a expansão do Programa de Saúde Materno-Infantil para todas as 18 províncias de Angola, como parte do compromisso com a qualidade de vida das famílias angolanas.</p>
<p>O programa inclui a construção de maternidades modernas equipadas com tecnologia de ponta, bem como a formação de médicos e enfermeiros especializados em saúde materna e pediatria.</p>
<p>"Cada mãe angolana merece ter acesso a atendimento de qualidade. Este programa vai salvar vidas", garantiu a responsável pela área de saúde do partido.</p>`,
    category: 'social',
    image: '/images/news/healthcare-program.png',
    featured: false,
    author: 'Nossa Equipe',
    views: 1523
  },
  {
    title: 'Revolução Educativa: Partido Liberal propõe escola gratuita e de qualidade',
    summary: 'Proposta inclui reforma curricular, formação de professores e investimento em tecnologia educativa.',
    content: `<p>A educação é um dos pilares fundamentais do programa do Partido Liberal. A proposta prevê uma transformação completa do sistema educativo angolano.</p>
<p>Entre as medidas está a garantia de ensino gratuito e de qualidade desde a primária até à universidade, com foco na formação de cidadãos preparados para os desafios do século XXI.</p>
<p>"A educação é o motor do desenvolvimento. Sem educação de qualidade, não há futuro sustentável", defendeu o coordenador da área de educação.</p>`,
    category: 'politica',
    image: '/images/news/education-initiative.png',
    featured: false,
    author: 'Assessoria de Imprensa',
    views: 1892
  },
  {
    title: 'Programa de Emprego Jovem vai criar 200 mil oportunidades em dois anos',
    summary: 'Iniciativa foca em empreendedorismo, formação profissional e parcerias com empresas privadas.',
    content: `<p>O Partido Liberal lançou o Programa de Emprego Jovem, uma iniciativa ambiciosa que visa criar 200 mil oportunidades de emprego para jovens angolanos num período de dois anos.</p>
<p>O programa combina formação profissional, apoio ao empreendedorismo e parcerias estratégicas com o sector privado para garantir oportunidades reais de trabalho.</p>
<p>"Os jovens são o futuro de Angola. Precisamos dar-lhes as ferramentas para construir esse futuro", afirmou o responsável pela pasta da juventude.</p>`,
    category: 'economia',
    image: '/images/news/youth-empowerment.png',
    featured: false,
    author: 'Redação PL',
    views: 2156
  },
  {
    title: 'Plano de Infraestrutura prevê investimentos de 50 mil milhões de kwanzas',
    summary: 'Programa inclui estradas, pontes, energia elétrica e água potável para todas as comunidades.',
    content: `<p>O Partido Liberal apresentou o seu ambicioso Plano Nacional de Infraestrutura, que prevê investimentos de 50 mil milhões de kwanzas nos próximos cinco anos.</p>
<p>O plano abrange todas as províncias do país, com foco especial nas zonas rurais mais carenciadas de infraestruturas básicas.</p>
<p>"Não podemos aceitar que em pleno século XXI ainda existam angolanos sem acesso a água potável e energia elétrica", declarou o coordenador das infraestruturas.</p>`,
    category: 'economia',
    image: '/images/news/infrastructure-project.png',
    featured: false,
    author: 'Secretaria-Geral',
    views: 1438
  },
  {
    title: 'Partido Liberal realiza encontro comunitário em Benguela',
    summary: 'Evento reuniu mais de 5.000 pessoas para discutir propostas para a província.',
    content: `<p>Mais de 5.000 pessoas participaram do encontro comunitário organizado pelo Partido Liberal na província de Benguela, num evento marcado por grande entusiasmo e participação popular.</p>
<p>Os líderes do partido apresentaram as propostas específicas para a província, incluindo investimentos no porto de Lobito, reabilitação de estradas e apoio à pesca artesanal.</p>
<p>"Benguela tem um potencial extraordinário. Vamos transformar essa província num exemplo de desenvolvimento", prometeu o coordenador provincial.</p>`,
    category: 'social',
    image: '/images/news/community-event.png',
    featured: false,
    author: 'Delegação de Benguela',
    views: 987
  },
  {
    title: 'Coletiva de Imprensa: Partido Liberal apresenta equipe técnica',
    summary: 'Especialistas de diversas áreas integram equipe que vai liderar a transformação do país.',
    content: `<p>Em coletiva de imprensa realizada hoje, o Partido Liberal apresentou a sua equipe técnica, composta por especialistas de diversas áreas que vão liderar a transformação do país.</p>
<p>A equipe inclui economistas, médicos, engenheiros e educadores com experiência reconhecida, tanto em Angola como no exterior.</p>
<p>"Montamos uma equipe de excelência. São angolanos comprometidos com o futuro do nosso país", afirmou o Presidente do partido durante a apresentação.</p>`,
    category: 'imprensa',
    image: '/images/news/press-conference.png',
    featured: false,
    author: 'Assessoria de Comunicação',
    views: 1256
  },
  {
    title: 'Programa de Apoio à Agricultura Familiar vai beneficiar 100 mil famílias',
    summary: 'Iniciativa inclui financiamento, formação técnica e acesso a mercados para pequenos produtores.',
    content: `<p>O Partido Liberal lançou o Programa de Apoio à Agricultura Familiar, uma iniciativa que vai beneficiar directamente 100 mil famílias de pequenos produtores em todo o país.</p>
<p>O programa prevê financiamento acessível, formação técnica, distribuição de sementes e equipamentos, bem como apoio na comercialização dos produtos.</p>
<p>"A agricultura familiar é a base da segurança alimentar. Vamos dar condições para que os nossos agricultores produzam mais e melhor", garantiu o coordenador da área rural.</p>`,
    category: 'economia',
    image: '/images/news/agriculture-support.png',
    featured: false,
    author: 'Redação PL',
    views: 1678
  }
];

// GET - Verificar status
export async function GET() {
  return NextResponse.json({ 
    message: 'Seed API Ready',
    newsCount: newsData.length,
    supabaseConfigured: !!(SUPABASE_URL && SUPABASE_SERVICE_KEY)
  });
}

// POST - Inserir notícias
export async function POST(request: NextRequest) {
  try {
    // Verificar autorização simples
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.SECRET_KEY || 'partido-liberal-seed-2024'}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    // Primeiro, limpar notícias existentes
    await fetch(`${SUPABASE_URL}/rest/v1/News?id=neq.00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    const results = [];

    // Inserir novas notícias
    for (const news of newsData) {
      const slug = generateSlug(news.title);
      
      const postData = {
        id: uuidv4(),
        title: news.title,
        slug: slug,
        summary: news.summary,
        content: news.content,
        image: news.image,
        category: news.category,
        published: true,
        featured: news.featured,
        author: news.author,
        views: news.views,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/News?select=*`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        results.push({ title: news.title, success: true });
      } else {
        const error = await res.text();
        results.push({ title: news.title, success: false, error });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${results.filter(r => r.success).length}/${newsData.length} notícias inseridas`,
      results 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
