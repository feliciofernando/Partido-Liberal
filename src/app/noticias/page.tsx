"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Eye,
  ChevronLeft,
  Newspaper,
  Filter,
} from "lucide-react";

// Category labels
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

interface NewsItem {
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

// Mock data for fallback
const mockNews: NewsItem[] = [
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

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news?limit=100");
        if (response.ok) {
          const data = await response.json();
          if (data.news && data.news.length > 0) {
            setNews(data.news);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log("Error fetching news");
      }
      setNews(mockNews);
      setLoading(false);
    }
    fetchNews();
  }, []);

  // Get unique categories from news
  const categories = [...new Set(news.map((n) => n.category))];
  
  // Filter news by category
  const filteredNews = selectedCategory 
    ? news.filter((n) => n.category === selectedCategory)
    : news;

  // Calculate stats
  const totalViews = news.reduce((acc, n) => acc + (n.views || 0), 0);
  const featuredCount = news.filter((n) => n.featured).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/#noticias"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar à página inicial
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Newspaper className="w-7 h-7" />
            <h1 className="text-3xl md:text-4xl font-bold">Todas as Notícias</h1>
          </div>
          <p className="text-white/70 text-base max-w-2xl">
            Fique por dentro das últimas novidades e atualizações do Partido Liberal de Angola.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtrar por categoria:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-slate-800 hover:bg-slate-700" : ""}
            >
              Todas ({news.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-slate-800 hover:bg-slate-700" : ""}
              >
                {categoryLabels[cat] || cat} ({news.filter((n) => n.category === cat).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          <span>
            Mostrando <strong className="text-foreground">{filteredNews.length}</strong> de <strong className="text-foreground">{news.length}</strong> notícias
          </span>
          {filteredNews.filter((n) => n.featured).length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {filteredNews.filter((n) => n.featured).length} em destaque
            </span>
          )}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <Card className="text-center py-16 border-dashed">
            <CardContent>
              <Newspaper className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma notícia encontrada</h2>
              <p className="text-slate-500 mb-4">Não há notícias nesta categoria.</p>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Ver todas as notícias
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/noticia/${item.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-slate-200">
                  <div className="h-44 relative overflow-hidden bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <Newspaper className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium bg-white/95 text-slate-700">
                      {categoryLabels[item.category] || item.category}
                    </span>
                    {item.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium bg-amber-500 text-white">
                        Destaque
                      </span>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-slate-700 transition-colors mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
