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
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Icon mapping keyed by area id
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  health: Heart,
  education: GraduationCap,
  economy: Briefcase,
  infrastructure: Building2,
  environment: Leaf,
  security: Shield,
  youth: Users,
  technology: Zap,
};

// Area keys in display order
const areaKeys = [
  "health",
  "education",
  "economy",
  "infrastructure",
  "environment",
  "security",
  "youth",
  "technology",
] as const;

export function ProgramSection() {
  const { t } = useTranslation();

  // Build program areas from translations
  const programAreas = areaKeys.map((key) => {
    const area = t.program.areas[key];
    return {
      id: key,
      icon: iconMap[key],
      title: area.title,
      summary: area.description,
      points: area.items,
    };
  });

  return (
    <section id="programa" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            {t.program.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.program.heading.split(' ').slice(0, -1).join(' ')} <span className="text-party-blue">{t.program.heading.split(' ').slice(-1)}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.program.description}
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
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <area.icon className="h-6 w-6 text-blue-600" />
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
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <area.icon className="h-5 h-5 text-blue-600" />
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
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
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
            {t.program.downloadPDF}
          </Button>
        </div>
      </div>
    </section>
  );
}
