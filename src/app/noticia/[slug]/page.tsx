import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailClient } from "./NewsDetailClient";
import { getSupabaseHeaders } from "@/lib/supabase-public";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Fallback data
const mockNews = [
  {
    id: '1',
    title: 'Partido Liberal lança programa de governo para 2024-2029',
    slug: 'programa-governo-2024-2029',
    summary: 'Propostas incluem investimentos massivos em saúde, educação e infraestrutura em todas as províncias.',
    content: `<p>O Partido Liberal apresentou hoje o seu programa de governo para o período 2024-2029, com propostas ambiciosas para transformar Angola.</p>
<h2>Principais Medidas</h2>
<p>Entre as principais medidas estão:</p>
<ul>
<li><strong>Educação:</strong> Investimento de 30% do orçamento em educação, com construção de 500 novas escolas</li>
<li><strong>Emprego:</strong> Criação de 500 mil novos postos de trabalho através de parcerias público-privadas</li>
<li><strong>Economia:</strong> Redução de impostos para pequenas empresas e empreendedores</li>
<li><strong>Saúde:</strong> Expansão da rede hospitalar para todas as províncias</li>
</ul>
<h2>Processo de Consulta</h2>
<p>O programa foi elaborado após ampla consulta popular, com mais de 100 audiências públicas em todas as províncias do país. Milhares de cidadãos participaram ativamente com sugestões e propostas.</p>
<blockquote>
<p>"Este programa reflete os anseios e esperanças do povo angolano. É um compromisso com o futuro do nosso país."</p>
</blockquote>
<p>A próxima etapa será a apresentação detalhada de cada eixo temático em eventos regionais programados para os próximos meses.</p>`,
    image: null,
    category: 'comunicado',
    featured: true,
    published: true,
    author: 'Redação PL',
    views: 1543,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Comício em Saurimo reúne mais de 10 mil pessoas',
    slug: 'comicio-saurimo-10-mil',
    summary: 'Evento marcou o lançamento da campanha na província da Lunda Sul com forte presença de jovens.',
    content: `<p>Mais de 10 mil pessoas participaram do comício do Partido Liberal em Saurimo, na província da Lunda Sul.</p>
<p>O evento contou com apresentações culturais e discursos dos candidatos locais, que destacaram as propostas para a região, incluindo:</p>
<ul>
<li>Investimentos na rede elétrica</li>
<li>Melhoria das estradas provinciais</li>
<li>Criação de um polo universitário</li>
</ul>
<p>A mobilização popular demonstrou o forte apoio do Partido Liberal na região.</p>`,
    image: null,
    category: 'imprensa',
    featured: false,
    published: true,
    author: 'Nossa Equipe',
    views: 892,
    createdAt: new Date('2024-01-14').toISOString(),
  },
  {
    id: '3',
    title: 'Partido Liberal condena violência política',
    slug: 'condena-violencia-politica',
    summary: 'Nota oficial repudia atos de intolerância e convoca todos os partidos ao diálogo.',
    content: `<p>O Partido Liberal vem a público condenar veementemente todos os atos de violência política.</p>
<p>Em nota oficial, a liderança do partido convocou todos os partidos ao diálogo e à construção de uma democracia pacífica.</p>
<p>"A democracia se constrói com diálogo, não com violência. Repudiamos qualquer forma de intolerância política", afirmou o porta-voz do partido.</p>`,
    image: null,
    category: 'nota_oficial',
    featured: false,
    published: true,
    author: 'Secretaria-Geral',
    views: 654,
    createdAt: new Date('2024-01-13').toISOString(),
  },
  {
    id: '4',
    title: 'Candidatos do PL participam de debate televisivo',
    slug: 'debate-televisivo-candidatos',
    summary: 'Representantes apresentaram propostas para os setores de saúde e educação.',
    content: `<p>Os candidatos do Partido Liberal participaram de um debate televisivo transmitido em rede nacional.</p>
<p>Durante o evento, foram apresentadas propostas detalhadas para os setores de saúde e educação, com destaque para:</p>
<ul>
<li>Construção de 50 novos hospitais</li>
<li>Contratação de 10 mil professores</li>
<li>Redução das listas de espera no SNS</li>
</ul>`,
    image: null,
    category: 'imprensa',
    featured: false,
    published: true,
    author: 'Assessoria de Imprensa',
    views: 1234,
    createdAt: new Date('2024-01-12').toISOString(),
  },
];

// Fetch news by slug
async function getNewsBySlug(slug: string) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/News?slug=eq.${slug}&published=eq.true&select=*`,
      {
        headers: getSupabaseHeaders(),
        cache: "no-store",
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      }
    }
  } catch (error) {
    console.log("Error fetching news from Supabase");
  }
  
  return mockNews.find(n => n.slug === slug);
}

// Fetch all news for sidebar
async function getAllNews() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/News?published=eq.true&select=*&order=createdAt.desc&limit=10`,
      {
        headers: getSupabaseHeaders(),
        cache: "no-store",
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log("Error fetching news from Supabase");
  }
  
  return mockNews;
}

// Fetch upcoming events
async function getUpcomingEvents() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Event?date=gte.${today}&select=*&order=date.asc&limit=3`,
      {
        headers: getSupabaseHeaders(),
        cache: "no-store",
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log("Error fetching events");
  }
  
  return [];
}

// Fetch leaders
async function getLeaders() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Leader?select=*&limit=3`,
      {
        headers: getSupabaseHeaders(),
        cache: "no-store",
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log("Error fetching leaders");
  }
  
  return [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const news = await getNewsBySlug(resolvedParams.slug);
  
  if (!news) {
    return {
      title: "Notícia não encontrada - Partido Liberal",
    };
  }
  
  return {
    title: `${news.title} - Partido Liberal`,
    description: news.summary,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const news = await getNewsBySlug(resolvedParams.slug);
  
  if (!news) {
    notFound();
  }
  
  const allNews = await getAllNews();
  const otherNews = allNews.filter((n: any) => n.id !== news.id).slice(0, 4);
  const upcomingEvents = await getUpcomingEvents();
  const leaders = await getLeaders();
  
  return (
    <NewsDetailClient
      news={news}
      otherNews={otherNews}
      upcomingEvents={upcomingEvents}
      leaders={leaders}
    />
  );
}
