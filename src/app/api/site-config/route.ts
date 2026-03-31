import { NextResponse } from 'next/server'
import { supabasePublicGetOne } from '@/lib/supabase-public'

const defaultTimeline = [
  { year: "2010", title: "Fundação", desc: "O Partido Liberal foi fundado por um grupo de cidadãos comprometidos com a mudança." },
  { year: "2015", title: "Expansão Nacional", desc: "Chegamos a todas as 18 províncias de Angola." },
  { year: "2020", title: "Crescimento Expressivo", desc: "Triplicamos o número de membros e apoiantes." },
  { year: "2025", title: "Presente", desc: "Preparados para as eleições com propostas inovadoras." },
]

function getDefaultConfig() {
  return {
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
    videoUrl: '',
    videoTitle: 'Vídeo Institucional',
    partyDescription: 'Fundado com a missão de transformar Angola em uma nação próspera e justa, o Partido Liberal representa a voz da mudança e do progresso.',
    partyTitle: 'Conheça o Partido Liberal',
    partySubtitle: 'O Partido',
    timeline: defaultTimeline
  }
}

export async function GET() {
  try {
    const config = await supabasePublicGetOne('SiteConfig?select=*&limit=1')
    if (config) {
      return NextResponse.json({ config: { ...getDefaultConfig(), ...config } })
    }
    return NextResponse.json({ config: getDefaultConfig() })
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json({ config: getDefaultConfig() })
  }
}
