"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, Image, FileText, Share2, Smartphone, FileImage, Loader2, Package } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Helper function to format numbers consistently (avoid hydration mismatch)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface KitItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  fileUrl: string | null;
  thumbnail: string | null;
  downloads: number;
  active: boolean;
}

const typeIcons: Record<string, any> = {
  avatar: Image,
  sticker: Smartphone,
  banner: FileImage,
  flyer: FileImage,
  documento: FileText,
  imagem: Image,
  video: FileImage,
  audio: FileImage,
  apresentacao: FileText,
};

// Map Portuguese type keys to English translation keys
const typeKeyMap: Record<string, string> = {
  avatar: "avatar",
  sticker: "sticker",
  banner: "banner",
  flyer: "flyer",
  documento: "document",
  imagem: "image",
  video: "video",
  audio: "audio",
  apresentacao: "presentation",
};

function getMockKitItems(t: any): KitItem[] {
  return [
    {
      id: '1',
      title: t.kit.mock.bannerCampaign,
      description: t.kit.mock.bannerCampaignDesc,
      type: 'banner',
      fileUrl: '#',
      thumbnail: '/images/kit/banner-campanha.png',
      downloads: 1250,
      active: true,
    },
    {
      id: '2',
      title: t.kit.mock.avatarProfile,
      description: t.kit.mock.avatarProfileDesc,
      type: 'avatar',
      fileUrl: '#',
      thumbnail: '/images/kit/avatar-perfil.png',
      downloads: 3420,
      active: true,
    },
    {
      id: '3',
      title: t.kit.mock.flyerRegional,
      description: t.kit.mock.flyerRegionalDesc,
      type: 'flyer',
      fileUrl: '#',
      thumbnail: '/images/kit/flyer-evento.png',
      downloads: 890,
      active: true,
    },
    {
      id: '4',
      title: t.kit.mock.stickersWhatsApp,
      description: t.kit.mock.stickersWhatsAppDesc,
      type: 'sticker',
      fileUrl: '#',
      thumbnail: '/images/kit/sticker-whatsapp.png',
      downloads: 5670,
      active: true,
    },
    {
      id: '5',
      title: t.kit.mock.govDoc,
      description: t.kit.mock.govDocDesc,
      type: 'documento',
      fileUrl: '#',
      thumbnail: '/images/kit/documento-oficial.png',
      downloads: 2150,
      active: true,
    },
    {
      id: '6',
      title: t.kit.mock.socialBanner,
      description: t.kit.mock.socialBannerDesc,
      type: 'banner',
      fileUrl: '#',
      thumbnail: '/images/kit/banner-social.png',
      downloads: 1890,
      active: true,
    },
  ];
}

export function KitSection() {
  const { t } = useTranslation();
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKitItems = async () => {
      try {
        const response = await fetch("/api/kit");
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setKitItems(data.items.filter((item: KitItem) => item.active));
        } else {
          // Usar dados de exemplo se não houver dados
          setKitItems(getMockKitItems(t));
        }
      } catch (error) {
        console.error("Erro ao carregar kit items:", error);
        setKitItems(getMockKitItems(t));
      } finally {
        setLoading(false);
      }
    };

    fetchKitItems();
  }, []);

  const getTypeLabel = (type: string): string => {
    const mappedKey = typeKeyMap[type] || type;
    return (t.kit.types as Record<string, string>)[mappedKey] || type;
  };

  return (
    <section id="kit" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            {t.kit.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.kit.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.kit.description}
          </p>
        </div>

        {/* Accordion - Seção Colapsável */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="kit" className="border-0">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/50 bg-white">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-foreground text-lg">
                      {t.kit.materialsTitle}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {t.kit.materialsSubtitle}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {kitItems.length} {t.kit.items}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="px-6 pb-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-party-blue" />
                    </div>
                  ) : kitItems.length === 0 ? (
                    <Card className="text-center py-12 border-dashed">
                      <CardContent>
                        <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">{t.kit.noMaterials}</h3>
                        <p className="text-muted-foreground">
                          {t.kit.noMaterialsSoon}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kitItems.map((item) => (
                        <Card
                          key={item.id}
                          className="card-hover border shadow-sm overflow-hidden group"
                        >
                          {/* Preview Area - Mostra a imagem de capa */}
                          <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                {(() => {
                                  const IconComponent = typeIcons[item.type] || FileImage;
                                  return <IconComponent className="h-12 w-12 text-slate-400 mx-auto" />;
                                })()}
                              </div>
                            )}
                            <Badge className="absolute top-3 right-3 bg-white text-blue-700 border border-blue-200">
                              {getTypeLabel(item.type)}
                            </Badge>
                          </div>

                          <CardContent className="p-5 space-y-4">
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-party-blue transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.description || t.kit.fallbackDesc}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {formatNumber(item.downloads)} {t.kit.downloads}
                              </span>
                              {item.fileUrl ? (
                                <Button size="sm" className="btn-cta" asChild>
                                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-1" />
                                    {t.kit.download}
                                  </a>
                                </Button>
                              ) : (
                                <Button size="sm" className="btn-cta">
                                  <Download className="h-4 w-4 mr-1" />
                                  {t.kit.download}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Share CTA */}
                  <Card className="mt-6 bg-blue-gradient text-white border-0">
                    <CardContent className="p-6 text-center">
                      <Share2 className="h-10 w-10 mx-auto mb-3 opacity-80" />
                      <h3 className="text-lg font-semibold mb-2">{t.kit.shareTitle}</h3>
                      <p className="text-white/80 mb-4 text-sm">
                        {t.kit.shareDescription}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </Button>
                        <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </section>
  );
}
