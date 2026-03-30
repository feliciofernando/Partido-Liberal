"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Shield, Globe, Play, X } from "lucide-react";
import { useState, useEffect } from "react";

const defaultValues = [
  {
    icon: Target,
    title: "Liberdade",
    description: "Defendemos a liberdade individual como direito fundamental de cada cidadão.",
  },
  {
    icon: Heart,
    title: "Justiça Social",
    description: "Promovemos a igualdade de oportunidades e o bem-estar para todos os angolanos.",
  },
  {
    icon: Shield,
    title: "Democracia",
    description: "Acreditamos no poder do povo e na participação cívica ativa.",
  },
  {
    icon: Globe,
    title: "Desenvolvimento",
    description: "Buscamos o crescimento sustentável e o progresso de Angola.",
  },
];

const defaultTimeline = [
  { year: "2010", title: "Fundação", desc: "O Partido Liberal foi fundado por um grupo de cidadãos comprometidos com a mudança." },
  { year: "2015", title: "Expansão Nacional", desc: "Chegamos a todas as 18 províncias de Angola." },
  { year: "2020", title: "Crescimento Expressivo", desc: "Triplicamos o número de membros e apoiantes." },
  { year: "2025", title: "Presente", desc: "Preparados para as eleições com propostas inovadoras." },
];

interface SiteConfig {
  videoUrl?: string;
  videoTitle?: string;
  partyDescription?: string;
  partyTitle?: string;
  partySubtitle?: string;
  timeline?: typeof defaultTimeline;
}

const defaultConfig: SiteConfig = {
  videoUrl: '',
  videoTitle: 'Vídeo Institucional',
  partyDescription: 'Fundado com a missão de transformar Angola em uma nação próspera e justa, o Partido Liberal representa a voz da mudança e do progresso.',
  partyTitle: 'Conheça o Partido Liberal',
  partySubtitle: 'O Partido',
  timeline: defaultTimeline,
};

export function PartySection() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        const data = await res.json();
        if (data.config) {
          setConfig({ ...defaultConfig, ...data.config });
        }
      } catch (error) {
        console.log('Using default party config');
      }
    }
    loadConfig();
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string) => {
    if (!url) return null;
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(config.videoUrl || '');
  const vimeoId = getVimeoId(config.videoUrl || '');

  const renderVideoPlayer = () => {
    if (youtubeId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    if (vimeoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          className="w-full h-full absolute inset-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return null;
  };

  const timeline = config.timeline || defaultTimeline;

  return (
    <>
      <section id="partido" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-slate-100 text-slate-700 mb-4">
              {config.partySubtitle || 'O Partido'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {config.partyTitle || 'Conheça o Partido Liberal'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {config.partyDescription}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Video/Image */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center shadow-lg">
                {config.videoUrl ? (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="w-full h-full relative group"
                  >
                    {youtubeId && (
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt={config.videoTitle || 'Vídeo'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 text-slate-700 ml-1" />
                      </div>
                    </div>
                    <p className="absolute bottom-4 left-4 text-white font-medium">
                      {config.videoTitle}
                    </p>
                  </button>
                ) : (
                  <div className="text-center text-white p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <Play className="w-10 h-10 ml-1" />
                    </div>
                    <p className="text-white/80">{config.videoTitle || 'Vídeo Institucional'}</p>
                  </div>
                )}
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-200 rounded-lg -z-10" />
            </div>

            {/* Right - Values */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Nossos Valores Fundamentais
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {defaultValues.map((value) => (
                  <Card key={value.title} className="card-hover border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                        <value.icon className="h-6 w-6 text-slate-600" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {value.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="mt-20">
            <h3 className="text-2xl font-semibold text-center text-foreground mb-12">
              Nossa Trajetória
            </h3>
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200 hidden md:block" />

              {/* Timeline Items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-white p-6 rounded-xl shadow-sm border inline-block">
                        <Badge className="bg-slate-700 text-white mb-2">
                          {item.year}
                        </Badge>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-slate-600 border-4 border-white shadow" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && config.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="w-full max-w-5xl aspect-video relative">
            {renderVideoPlayer()}
          </div>
        </div>
      )}
    </>
  );
}
