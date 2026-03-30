"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
    content: '<p>O Partido Liberal apresentou hoje o seu programa de governo para o período 2024-2029.</p>',
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
    summary: 'Evento marcou o lançamento da campanha na província da Lunda Sul.',
    content: '<p>Mais de 10 mil pessoas participaram do comício.</p>',
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
    summary: 'Nota oficial repudia atos de intolerância.',
    content: '<p>O Partido Liberal condena veementemente todos os atos de violência.</p>',
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
    summary: 'Representantes apresentaram propostas para saúde e educação.',
    content: '<p>Os candidatos participaram de um debate televisivo.</p>',
    image: null,
    category: 'imprensa',
    featured: false,
    published: true,
    author: 'Assessoria',
    views: 1234,
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '5',
    title: 'Encontro com jovens empreendedores em Benguela',
    slug: 'encontro-jovens-empreendedores',
    summary: 'Evento discute políticas de apoio ao empreendedorismo juvenil.',
    content: '<p>Um encontro com jovens empreendedores foi realizado.</p>',
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
    summary: 'Espaço moderno vai atender militantes e eventos.',
    content: '<p>A nova sede foi inaugurada.</p>',
    image: null,
    category: 'institucional',
    featured: false,
    published: true,
    author: 'Secretaria-Geral',
    views: 543,
    createdAt: new Date('2024-01-10').toISOString(),
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

  return (
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
            {/* Grid de Notícias - Todas com mesma altura, sem espaços vazios */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {news.slice(0, 6).map((item) => (
                <Card
                  key={item.id}
                  className="rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 flex flex-col h-full"
                  onClick={() => handleNewsClick(item)}
                >
                  <div className="h-48 relative overflow-hidden flex-shrink-0">
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
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-blue-700">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-party-blue transition-colors mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{item.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
  );
}
