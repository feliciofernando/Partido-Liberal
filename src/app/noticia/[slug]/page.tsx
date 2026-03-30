import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Eye,
  Share2,
  ChevronLeft,
  MapPin,
  ArrowRight,
} from "lucide-react";

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

const categoryColors: Record<string, string> = {
  comunicado: "bg-party-blue text-white",
  imprensa: "bg-party-yellow text-party-blue-dark",
  nota_oficial: "bg-green-100 text-green-700",
  artigo: "bg-purple-100 text-purple-700",
  politica: "bg-blue-100 text-blue-700",
  economia: "bg-amber-100 text-amber-700",
  social: "bg-rose-100 text-rose-700",
  institucional: "bg-slate-100 text-slate-700",
};

const categoryLabels: Record<string, string> = {
  comunicado: "Comunicado",
  imprensa: "Imprensa",
  nota_oficial: "Nota Oficial",
  artigo: "Artigo",
  politica: "Política",
  economia: "Economia",
  social: "Social",
  institucional: "Institucional",
};

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Fetch news by slug
async function getNewsBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/News?slug=eq.${slug}&published=eq.true&select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
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
  
  // Fallback to mock data
  return mockNews.find(n => n.slug === slug);
}

// Fetch all news for sidebar
async function getAllNews() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/News?published=eq.true&select=*&order=createdAt.desc&limit=10`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
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
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Events?date=gte.${today}&select=*&order=date.asc&limit=3`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
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
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Leader?select=*&limit=3`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-party-blue text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/#noticias"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar às notícias
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 md:h-96">
        {news.image ? (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-party-blue via-party-blue-dark to-party-blue" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <Badge
            className={`${categoryColors[news.category] || "bg-gray-500 text-white"} text-sm px-4 py-1`}
          >
            {categoryLabels[news.category] || news.category}
          </Badge>
        </div>
        
        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
              {news.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article */}
          <article className="flex-1 max-w-4xl">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(news.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-party-blue font-medium">{news.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{news.views || 0} visualizações</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8 p-6 bg-muted/30 border-l-4 border-party-blue rounded-r-lg">
              <p className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed">
                {news.summary}
              </p>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert 
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-party-blue
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-party-blue prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-blockquote:border-l-party-blue prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                prose-li:text-foreground/80 prose-li:my-1
                prose-img:rounded-lg prose-img:shadow-md
                overflow-hidden break-words [&_*]:max-w-full [&_img]:h-auto [&_img]:w-auto [&_table]:block [&_table]:overflow-x-auto [&_pre]:overflow-x-auto [&_ul]:break-words [&_ol]:break-words"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Share Section */}
            <Separator className="my-10" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/20 rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">Gostou desta notícia?</h3>
                <p className="text-sm text-muted-foreground">Compartilhe com seus amigos!</p>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-party-blue text-party-blue hover:bg-party-blue hover:text-white"
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      `https://partido-liberal.vercel.app/noticia/${news.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Facebook
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${news.title} - Partido Liberal\n\nhttps://partido-liberal.vercel.app/noticia/${news.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Back to news */}
            <div className="mt-10 pt-6 border-t">
              <Link
                href="/#noticias"
                className="inline-flex items-center gap-2 text-party-blue hover:text-party-blue-dark transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Ver todas as notícias
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-8">
              {/* Other News */}
              <div className="bg-muted/20 rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-party-blue" />
                  Outras Notícias
                </h3>
                <div className="space-y-4">
                  {otherNews.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/noticia/${item.slug}`}
                      className="group block p-4 rounded-lg bg-background hover:bg-party-blue/5 transition-colors border border-transparent hover:border-party-blue/20"
                    >
                      <Badge
                        variant="outline"
                        className={`text-xs mb-2 ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}
                      >
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                      <h4 className="font-medium text-foreground group-hover:text-party-blue transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatShortDate(item.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="bg-muted/20 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-party-blue" />
                    Próximos Eventos
                  </h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event: any) => (
                      <div key={event.id} className="p-4 rounded-lg bg-background border">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-lg bg-party-blue text-white flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold">{new Date(event.date).getDate()}</span>
                            <span className="text-[10px] uppercase">{MONTHS_PT[new Date(event.date).getMonth()].slice(0, 3)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground line-clamp-1">{event.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {event.province || event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaders */}
              {leaders.length > 0 && (
                <div className="bg-muted/20 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-party-blue" />
                    Nossa Liderança
                  </h3>
                  <div className="space-y-4">
                    {leaders.map((leader: any) => (
                      <div key={leader.id} className="p-4 rounded-lg bg-background border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-party-blue text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm overflow-hidden">
                          {leader.photo ? (
                            <img src={leader.photo} alt={leader.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            leader.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{leader.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{leader.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Card */}
              <div className="rounded-xl p-6 bg-gradient-to-br from-party-blue to-party-blue-dark text-white">
                <h4 className="font-bold text-lg mb-2">Junte-se a nós!</h4>
                <p className="text-white/80 mb-4">
                  Faça parte da mudança. Cadastre-se como voluntário e ajude a construir um Angola melhor.
                </p>
                <Button
                  asChild
                  className="w-full bg-party-yellow text-party-blue-dark hover:bg-party-yellow/90 font-semibold"
                >
                  <Link href="/#voluntarios">Ser Voluntário</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
