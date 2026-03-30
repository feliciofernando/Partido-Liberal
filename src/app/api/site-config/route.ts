import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const defaultTimeline = [
  { year: "2010", title: "Fundação", desc: "O Partido Liberal foi fundado por um grupo de cidadãos comprometidos com a mudança." },
  { year: "2015", title: "Expansão Nacional", desc: "Chegamos a todas as 18 províncias de Angola." },
  { year: "2020", title: "Crescimento Expressivo", desc: "Triplicamos o número de membros e apoiantes." },
  { year: "2025", title: "Presente", desc: "Preparados para as eleições com propostas inovadoras." },
]

// GET - Buscar configurações do site (público)
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/SiteConfig?select=*&limit=1`, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ 
        config: getDefaultConfig() 
      })
    }

    const data = await res.json()
    
    if (data && data.length > 0) {
      // Parse timeline if it's a string
      const config = data[0]
      if (typeof config.timeline === 'string') {
        try {
          config.timeline = JSON.parse(config.timeline)
        } catch {
          config.timeline = defaultTimeline
        }
      }
      return NextResponse.json({ config })
    }

    return NextResponse.json({ config: getDefaultConfig() })
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json({ config: getDefaultConfig() })
  }
}

function getDefaultConfig() {
  return {
    heroImage: '/hero-bg.png',
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
