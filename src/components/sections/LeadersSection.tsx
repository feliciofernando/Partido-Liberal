"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  MapPin,
  FileText,
  Globe,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Leader {
  id: string;
  name: string;
  slug: string;
  role: string;
  province: string | null;
  bio: string | null;
  photo: string | null;
  proposals: string | null;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  order: number;
  active: boolean;
}

const mockLeaders: Leader[] = [
  {
    id: '1',
    name: 'Dr. António Mendes',
    slug: 'antonio-mendes',
    role: 'Presidente do Partido',
    province: 'Luanda',
    bio: 'Líder experiente com mais de 20 anos de dedicação à política angolana. Economista formado pela Universidade de Lisboa, com pós-graduação em Gestão Pública.',
    photo: null,
    proposals: 'Defendo a modernização do Estado, a diversificação da economia e o investimento massivo em educação e saúde para todos os angolanos.',
    socialFacebook: 'https://facebook.com',
    socialTwitter: 'https://twitter.com',
    socialInstagram: 'https://instagram.com',
    socialLinkedin: 'https://linkedin.com',
    order: 1,
    active: true,
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    slug: 'maria-santos',
    role: 'Vice-Presidente',
    province: 'Benguela',
    bio: 'Advogada e ativista dos direitos humanos. Pioneira na luta pela igualdade de género em Angola.',
    photo: null,
    proposals: 'Minha prioridade é garantir direitos iguais para todos, combater a corrupção e promover a justiça social.',
    socialFacebook: 'https://facebook.com',
    socialTwitter: 'https://twitter.com',
    socialInstagram: null,
    socialLinkedin: 'https://linkedin.com',
    order: 2,
    active: true,
  },
  {
    id: '3',
    name: 'Eng. João Silva',
    slug: 'joao-silva',
    role: 'Secretário-Geral',
    province: 'Huambo',
    bio: 'Engenheiro civil com vasta experiência em projetos de infraestrutura.',
    photo: null,
    proposals: 'Vamos construir estradas, pontes, escolas e hospitais em todas as províncias.',
    socialFacebook: 'https://facebook.com',
    socialTwitter: null,
    socialInstagram: 'https://instagram.com',
    socialLinkedin: null,
    order: 3,
    active: true,
  },
  {
    id: '4',
    name: 'Dr. Pedro Neto',
    slug: 'pedro-neto',
    role: 'Candidato a Deputado',
    province: 'Lunda Sul',
    bio: 'Médico comunitário dedicado à saúde rural.',
    photo: null,
    proposals: 'Saúde de qualidade para todos, com hospitais equipados e profissionais bem formados.',
    socialFacebook: 'https://facebook.com',
    socialTwitter: 'https://twitter.com',
    socialInstagram: null,
    socialLinkedin: null,
    order: 4,
    active: true,
  },
  {
    id: '5',
    name: 'Dra. Ana Costa',
    slug: 'ana-costa',
    role: 'Candidata a Deputada',
    province: 'Cabinda',
    bio: 'Professora universitária e especialista em educação.',
    photo: null,
    proposals: 'Educação gratuita e de qualidade para todas as crianças angolanas.',
    socialFacebook: null,
    socialTwitter: 'https://twitter.com',
    socialInstagram: 'https://instagram.com',
    socialLinkedin: 'https://linkedin.com',
    order: 5,
    active: true,
  },
  {
    id: '6',
    name: 'Lic. Carlos Ferreira',
    slug: 'carlos-ferreira',
    role: 'Secretário de Juventude',
    province: 'Huíla',
    bio: 'Jovem líder estudantil e empreendedor.',
    photo: null,
    proposals: 'Emprego jovem, apoio ao empreendedorismo e participação ativa na vida cívica.',
    socialFacebook: 'https://facebook.com',
    socialTwitter: 'https://twitter.com',
    socialInstagram: 'https://instagram.com',
    socialLinkedin: null,
    order: 6,
    active: true,
  },
];

export function LeadersSection() {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Leader[]>(mockLeaders);
  const [loading, setLoading] = useState(true);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch("/api/leaders");
        const data = await response.json();
        if (data.leaders && data.leaders.length > 0) {
          setLeaders(data.leaders.filter((l: Leader) => l.active));
        }
      } catch (error) {
        console.log("Usando dados de fallback para líderes");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <>
      <section id="lideranca" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-4">
              Liderança
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos <span className="text-party-blue">Líderes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça os homens e mulheres dedicados que lideram nossa luta por um Angola melhor.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-party-blue" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.slice(0, 6).map((leader) => (
                <div
                  key={leader.id}
                  className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedLeader(leader)}
                >
                  {/* Photo Area */}
                  <div className="h-48 bg-party-blue flex items-center justify-center relative overflow-hidden">
                    {leader.photo ? (
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center">
                        {leader.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    {leader.province && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                        {leader.province}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="inline-block px-3 py-1 border border-slate-200 text-slate-600 text-xs font-medium rounded-full mb-2">
                      {leader.role}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-party-blue transition-colors">
                      {leader.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700"
              onClick={() => router.push('/lideres')}
            >
              Ver Todos os Candidatos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Leader Detail Modal */}
      <Dialog open={!!selectedLeader} onOpenChange={(open) => !open && setSelectedLeader(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLeader && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Perfil do Líder</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header with Photo */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-party-blue flex items-center justify-center flex-shrink-0">
                    {selectedLeader.photo ? (
                      <img
                        src={selectedLeader.photo}
                        alt={selectedLeader.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {selectedLeader.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <Badge className="bg-slate-100 text-slate-700 mb-2">
                      {selectedLeader.role}
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedLeader.name}
                    </h2>
                    {selectedLeader.province && (
                      <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedLeader.province}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-500" />
                    Biografia
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedLeader.bio || "Biografia não disponível."}
                  </p>
                </div>

                {/* Proposals */}
                {selectedLeader.proposals && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-500" />
                      Propostas
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedLeader.proposals}
                    </p>
                  </div>
                )}

                {/* Social Networks */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-slate-500" />
                    Redes Sociais
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedLeader.socialFacebook && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedLeader.socialFacebook} target="_blank" rel="noopener noreferrer">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </a>
                      </Button>
                    )}
                    {selectedLeader.socialTwitter && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedLeader.socialTwitter} target="_blank" rel="noopener noreferrer">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </a>
                      </Button>
                    )}
                    {selectedLeader.socialInstagram && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedLeader.socialInstagram} target="_blank" rel="noopener noreferrer">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                          Instagram
                        </a>
                      </Button>
                    )}
                    {selectedLeader.socialLinkedin && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={selectedLeader.socialLinkedin} target="_blank" rel="noopener noreferrer">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {!selectedLeader.socialFacebook && !selectedLeader.socialTwitter && !selectedLeader.socialInstagram && !selectedLeader.socialLinkedin && (
                      <p className="text-sm text-muted-foreground">Nenhuma rede social cadastrada.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
