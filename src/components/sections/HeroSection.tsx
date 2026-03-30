"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface SiteConfig {
  heroImage?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText1?: string;
  heroButtonLink1?: string;
  heroButtonText2?: string;
  heroButtonLink2?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
}

const defaultConfig: SiteConfig = {
  heroImage: '',
  heroBadge: 'Eleições 2025 - Juntos pelo Futuro de Angola',
  heroTitle: 'Construindo um Angola Melhor para Todos',
  heroSubtitle: 'O Partido Liberal é a voz da mudança, da liberdade e do progresso. Junte-se a nós nesta jornada rumo a um futuro próspero e justo para todos os angolanos.',
  heroButtonText1: 'Seja Voluntário',
  heroButtonLink1: '#voluntarios',
  heroButtonText2: 'Conheça Nosso Programa',
  heroButtonLink2: '#programa',
  stat1Value: '15K+',
  stat1Label: 'Voluntários Ativos',
  stat2Value: '18',
  stat2Label: 'Províncias Presentes',
  stat3Value: '50+',
  stat3Label: 'Eventos Este Mês',
  stat4Value: '100K+',
  stat4Label: 'Apoiantes',
};

export function HeroSection() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        const data = await res.json();
        if (data.config) {
          setConfig({ ...defaultConfig, ...data.config });
        }
      } catch (error) {
        console.log('Using default hero config');
      }
    }
    loadConfig();
  }, []);

  // Parse title to highlight "Angola Melhor" part
  const titleParts = config.heroTitle?.split('Angola') || ['Construindo um Angola Melhor para Todos'];
  const hasHighlight = config.heroTitle?.includes('Angola');

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {config.heroImage ? (
          <Image
            src={config.heroImage}
            alt="Partido Liberal - Campanha"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-party-blue via-party-blue-dark to-party-blue" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-party-blue/95 via-party-blue/85 to-party-blue/70" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-party-yellow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          {config.heroBadge && (
            <Badge
              variant="outline"
              className="bg-white/10 border-white/20 text-white mb-6 px-4 py-2"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              {config.heroBadge}
            </Badge>
          )}

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {hasHighlight ? (
              <>
                {titleParts[0]}
                <span className="text-party-yellow">Angola{titleParts.slice(1).join('Angola')}</span>
              </>
            ) : (
              config.heroTitle || 'Construindo um Angola Melhor para Todos'
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {config.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {config.heroButtonLink1 && config.heroButtonText1 && (
              <Link href={config.heroButtonLink1}>
                <Button size="lg" className="btn-cta px-8 py-6 text-lg">
                  {config.heroButtonText1}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            {config.heroButtonLink2 && config.heroButtonText2 && (
              <Link href={config.heroButtonLink2}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-party-blue px-8 py-6 text-lg"
                >
                  {config.heroButtonText2}
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-party-yellow mb-2">
                {config.stat1Value}
              </div>
              <div className="text-sm text-white/70">{config.stat1Label}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-party-yellow mb-2">
                {config.stat2Value}
              </div>
              <div className="text-sm text-white/70">{config.stat2Label}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-party-yellow mb-2">
                {config.stat3Value}
              </div>
              <div className="text-sm text-white/70">{config.stat3Label}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-party-yellow mb-2">
                {config.stat4Value}
              </div>
              <div className="text-sm text-white/70">{config.stat4Label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
