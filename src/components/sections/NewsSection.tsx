"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Eye, Loader2 } from "lucide-react";

interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string | null;
  category: string;
  featured: boolean;
  published: boolean;
  author: string;
  views: number;
  createdAt: string;
}

// Fallback data when Supabase tables don't exist
const mockNews: News[] = [
  {
    id: '1',
    title: 'Partido Liberal lança programa de governo para 2024-2029',
    slug: 'programa-governo-2024-2029',
    summary: 'Propostas incluem investimentos massivos em saúde, educação e infraestrutura em todas as províncias.',
    content: '<p>O Partido Liberal apresentou hoje o seu programa de governo para o período 2024-2029, com propostas ambiciosas para transformar Angola.</p>',
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
    content: '<p>Mais de 10 mil pessoas participaram do comício do Partido Liberal em Saurimo.</p>',
    image: null,
    category: 'imprensa',
    featured: true,
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
    content: '<p>O Partido Liberal vem a público condenar veementemente todos os atos de violência política.</p>',
    image: null,
    category: 'nota_oficial',
    featured: true,
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
    content: '<p>Os candidatos do Partido Liberal participaram de um debate televisivo.</p>',
    image: null,
    category: 'imprensa',
    featured: false,
    published: true,
    author: 'Assessoria de Imprensa',
    views: 1234,
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '5',
    title: 'Encontro com jovens empreendedores em Benguela',
    slug: 'encontro-jovens-empreendedores',
    summary: 'Evento discute políticas de apoio ao empreendedorismo juvenil na região.',
    content: '<p>Um encontro com jovens empreendedores foi realizado em Benguela.</p>',
    image: null,
    category: 'social',
    featured: false,
    published: true,
    author: 'Juventude PL',
    views: 876,
    createdAt: new Date('2024-01-11').toISOString(),
  },
  {
    id: '6',
    title: 'Nova sede do partido inaugurada em Huambo',
    slug: 'nova-sede-huambo',
    summary: 'Espaço moderno vai atender militantes e realizar eventos partidários.',
    content: '<p>A nova sede do Partido Liberal em Huambo foi inaugurada.</p>',
    image: null,
    category: 'institucional',
    featured: false,
    published: true,
    author: 'Secretaria-Geral',
    views: 543,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '7',
    title: 'Programa de saúde materno-infantil apresentado',
    slug: 'programa-saude-materno-infantil',
    summary: 'Proposta prevê construção de maternidades em todas as províncias.',
    content: '<p>O programa de saúde materno-infantil foi apresentado pela equipe de saúde.</p>',
    image: null,
    category: 'politica',
    featured: false,
    published: true,
    author: 'Redação PL',
    views: 789,
    createdAt: new Date('2024-01-09').toISOString(),
  },
];

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

// Helper function to format dates consistently (avoid hydration mismatch)
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

export function NewsSection() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>(mockNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data.news && data.news.length > 0) {
          setNews(data.news);
        }
      } catch (error) {
        console.log("Using mock news data");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (item: News) => {
    router.push(`/noticia/${item.slug}`);
  };

  // Get up to 3 featured news, or first 3 if no featured
  const featuredNews = news.filter((n) => n.featured).slice(0, 3);
  const displayFeatured = featuredNews.length >= 3 
    ? featuredNews 
    : news.slice(0, 3);
  
  // Regular news are the ones not in featured
  const regularNews = news.filter((n) => !displayFeatured.find(f => f.id === n.id));

  return (
    <>
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              Notícias
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Últimas <span className="text-party-blue">Notícias</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-party-blue" />
            </div>
          ) : (
            <>
              {/* 3 Featured News Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayFeatured.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 ${
                      index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                    }`}
                    onClick={() => handleNewsClick(item)}
                  >
                    <div className={`${index === 0 ? 'h-72' : 'h-48'} relative overflow-hidden`}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-gradient" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-blue-700">
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </div>
                    <CardContent className={`${index === 0 ? 'p-6' : 'p-4'}`}>
                      <h3 className={`${index === 0 ? 'text-2xl' : 'text-lg'} font-semibold text-foreground group-hover:text-party-blue transition-colors mb-2 line-clamp-2`}>
                        {item.title}
                      </h3>
                      <p className={`text-muted-foreground ${index === 0 ? 'mb-4' : 'mb-3 text-sm line-clamp-2'}`}>
                        {item.summary}
                      </p>
                      <div className={`flex items-center ${index === 0 ? 'justify-between' : 'gap-3'} text-sm text-muted-foreground`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={index === 0 ? '' : 'text-xs'}>{formatDate(item.createdAt)}</span>
                        </div>
                        {index === 0 ? (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 font-medium">{item.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-slate-500" />
                              <span>{item.views || 0}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-500" />
                              <span className="text-xs">{item.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span className="text-xs">{item.views || 0}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Regular News - Horizontal List */}
              {regularNews.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {regularNews.slice(0, 4).map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-300 border-0"
                      onClick={() => handleNewsClick(item)}
                    >
                      <div className="h-32 relative overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-gradient-light" />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs bg-white/90 text-blue-700">
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-party-blue transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>{item.views || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Ver Todas Button */}
              <div className="text-center mt-10">
                <button
                  onClick={() => router.push('/noticias')}
                  className="inline-flex items-center px-6 py-3 border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Ver Todas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
