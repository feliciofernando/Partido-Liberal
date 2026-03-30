"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Heart,
  GraduationCap,
  Building2,
  Leaf,
  Shield,
  Briefcase,
  Zap,
  Users,
  ChevronDown,
} from "lucide-react";

const programAreas = [
  {
    id: "saude",
    icon: Heart,
    title: "Saúde",
    summary: "Investimentos massivos em hospitais, postos de saúde e formação de profissionais.",
    points: [
      "Construção de 50 novos hospitais provinciais",
      "Contratação de 20.000 profissionais de saúde",
      "Programa de saúde materno-infantil ampliado",
      "Medicamentos gratuitos para idosos e crianças",
      "Modernização dos sistemas hospitalares",
    ],
  },
  {
    id: "educacao",
    icon: GraduationCap,
    title: "Educação",
    summary: "Educação de qualidade para todos, desde o ensino primário até a universidade.",
    points: [
      "Escolas gratuitas em todas as comunidades",
      "Reforma curricular com foco em tecnologia",
      "Bolsas de estudo para alunos meritórios",
      "Formação contínua de professores",
      "Investimento em infraestrutura escolar",
    ],
  },
  {
    id: "economia",
    icon: Briefcase,
    title: "Economia",
    summary: "Diversificação econômica, apoio ao empreendedorismo e geração de empregos.",
    points: [
      "Redução de impostos para pequenas empresas",
      "Programa de microcrédito acessível",
      "Incentivo à agricultura familiar",
      "Criação de zonas económicas especiais",
      "Parcerias público-privadas estratégicas",
    ],
  },
  {
    id: "infraestrutura",
    icon: Building2,
    title: "Infraestrutura",
    summary: "Estradas, energia elétrica, água potável e habitação para todos.",
    points: [
      "Pavimentação de 5.000 km de estradas",
      "Eletrificação rural em todas as províncias",
      "Expansão da rede de abastecimento de água",
      "Programa de habitação social",
      "Transporte público moderno e acessível",
    ],
  },
  {
    id: "ambiente",
    icon: Leaf,
    title: "Meio Ambiente",
    summary: "Desenvolvimento sustentável, proteção ambiental e energias renováveis.",
    points: [
      "Investimento em energias renováveis",
      "Programa de reflorestamento nacional",
      "Gestão sustentável de recursos naturais",
      "Saneamento básico universal",
      "Políticas de combate às mudanças climáticas",
    ],
  },
  {
    id: "seguranca",
    icon: Shield,
    title: "Segurança",
    summary: "Paz, justiça e proteção para todos os cidadãos angolanos.",
    points: [
      "Modernização das forças de segurança",
      "Combate à corrupção e impunidade",
      "Reforma do sistema judicial",
      "Proteção dos direitos humanos",
      "Programas de prevenção à criminalidade",
    ],
  },
  {
    id: "juventude",
    icon: Users,
    title: "Juventude",
    summary: "Oportunidades, formação e apoio para os jovens angolanos.",
    points: [
      "Programa de emprego jovem",
      "Centros de formação profissional",
      "Apoio ao desporto e cultura",
      "Incentivo ao empreendedorismo juvenil",
      "Participação ativa na vida cívica",
    ],
  },
  {
    id: "tecnologia",
    icon: Zap,
    title: "Inovação & Tecnologia",
    summary: "Transformação digital e Angola como hub tecnológico africano.",
    points: [
      "Internet de alta velocidade em todo país",
      "Parques tecnológicos e incubadoras",
      "Formação em carreiras digitais",
      "Governo digital e serviços online",
      "Incentivo a startups tecnológicas",
    ],
  },
];

export function ProgramSection() {
  return (
    <section id="programa" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-slate-100 text-slate-700 mb-4">
            Programa de Governo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nosso <span className="text-party-blue">Plano para Angola</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Um programa de governo interativo. Clique em cada área para conhecer
            nossas propostas detalhadas para construir um Angola melhor.
          </p>
        </div>

        {/* Program Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {programAreas.map((area) => (
            <Card
              key={area.id}
              className="card-hover border-0 shadow-sm cursor-pointer overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <area.icon className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{area.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accordion Details */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {programAreas.map((area, index) => (
                <AccordionItem key={area.id} value={area.id} className="border-b last:border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <area.icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-foreground">{area.title}</span>
                        <p className="text-sm text-muted-foreground hidden md:block">{area.summary}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="ml-14 space-y-3">
                      {area.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-slate-400 mt-2" />
                          <p className="text-muted-foreground">{point}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Download CTA */}
        <div className="text-center mt-12">
          <Button className="btn-cta px-8">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Baixar Programa Completo (PDF)
          </Button>
        </div>
      </div>
    </section>
  );
}
