"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  User,
  Eye,
  Share2,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";

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

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  province: string;
  date: string;
  time: string;
  type: string;
}

interface Leader {
  id: string;
  name: string;
  role: string;
  province: string;
  bio: string;
  photo: string | null;
}

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
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

interface NewsDetailModalProps {
  news: News | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewsClick: (news: News) => void;
  allNews: News[];
}

export function NewsDetailModal({
  news,
  open,
  onOpenChange,
  onNewsClick,
  allNews,
}: NewsDetailModalProps) {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events
        const eventsRes = await fetch("/api/events?upcoming=true");
        const eventsData = await eventsRes.json();
        if (eventsData.events && eventsData.events.length > 0) {
          setRelatedEvents(eventsData.events.slice(0, 3));
        }

        // Fetch leaders
        const leadersRes = await fetch("/api/admin/posts?table=Leader");
        const leadersData = await leadersRes.json();
        if (leadersData.data && leadersData.data.length > 0) {
          setLeaders(leadersData.data.slice(0, 3));
        }
      } catch (error) {
        console.log("Error fetching related data");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  if (!news) return null;

  const otherNews = allNews.filter((n) => n.id !== news.id).slice(0, 4);

  const handleShare = async () => {
    const shareData = {
      title: news.title,
      text: news.summary,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing");
      }
    } else {
      // Fallback to WhatsApp
      window.open(
        `https://wa.me/?text=${encodeURIComponent(news.title + " - Partido Liberal")}`,
        "_blank"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header Image */}
            <div className="relative h-64 sm:h-80 flex-shrink-0">
              {news.image ? (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-party-blue via-party-blue-dark to-party-blue" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${
                    categoryColors[news.category] || "bg-gray-500 text-white"
                  } text-sm px-3 py-1`}
                >
                  {categoryLabels[news.category] || news.category}
                </Badge>
              </div>

              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {news.title}
                </h1>
              </div>
            </div>

            {/* Article Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-party-blue font-medium">
                      {news.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{news.views || 0} visualizações</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-lg text-foreground/80 font-medium mb-6 leading-relaxed border-l-4 border-party-blue pl-4 py-2 bg-muted/30">
                  {news.summary}
                </p>

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-party-blue prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />

                {/* Share Section */}
                <Separator className="my-8" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Gostou desta notícia? Compartilhe!
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="border-party-blue text-party-blue hover:bg-party-blue hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(
                            news.title + " - Partido Liberal"
                          )}`,
                          "_blank"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 border-l bg-muted/20 flex-shrink-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Other News */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-party-blue" />
                    Outras Notícias
                  </h3>
                  <div className="space-y-3">
                    {otherNews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onNewsClick(item)}
                        className="group cursor-pointer p-3 rounded-lg bg-background hover:bg-party-blue/5 transition-colors border border-transparent hover:border-party-blue/20"
                      >
                        <Badge
                          variant="outline"
                          className={`text-xs mb-2 ${
                            categoryColors[item.category] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                        <h4 className="font-medium text-sm text-foreground group-hover:text-party-blue transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatShortDate(item.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                {!loading && relatedEvents.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-party-blue" />
                      Próximos Eventos
                    </h3>
                    <div className="space-y-3">
                      {relatedEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 rounded-lg bg-background border"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-party-blue text-white flex flex-col items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold">
                                {new Date(event.date).getDate()}
                              </span>
                              <span className="text-[10px] uppercase">
                                {MONTHS_PT[new Date(event.date).getMonth()].slice(
                                  0,
                                  3
                                )}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground line-clamp-1">
                                {event.title}
                              </h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {event.province}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leaders */}
                {!loading && leaders.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-party-blue" />
                      Nossa Liderança
                    </h3>
                    <div className="space-y-3">
                      {leaders.map((leader) => (
                        <div
                          key={leader.id}
                          className="p-3 rounded-lg bg-background border flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-party-blue text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm overflow-hidden">
                            {leader.photo ? (
                              <img
                                src={leader.photo}
                                alt={leader.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              leader.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {leader.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {leader.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Card */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-party-blue to-party-blue-dark text-white">
                  <h4 className="font-semibold mb-2">Junte-se a nós!</h4>
                  <p className="text-sm text-white/80 mb-3">
                    Faça parte da mudança. Cadastre-se como voluntário.
                  </p>
                  <Button
                    className="w-full bg-party-yellow text-party-blue-dark hover:bg-party-yellow/90"
                    onClick={() => {
                      onOpenChange(false);
                      document
                        .getElementById("voluntarios")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Ser Voluntário
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
