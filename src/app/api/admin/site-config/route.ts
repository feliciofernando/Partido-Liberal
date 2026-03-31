import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar configurações
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const config = await db.siteConfig.findFirst()
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ config: null })
  }
}

// PUT - Salvar configurações
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Verificar se já existe configuração
    const existing = await db.siteConfig.findFirst()
    
    if (existing) {
      const config = await db.siteConfig.update({
        where: { id: existing.id },
        data: {
          heroImage: data.heroImage,
          heroBadge: data.heroBadge,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroButtonText1: data.heroButtonText1,
          heroButtonLink1: data.heroButtonLink1,
          heroButtonText2: data.heroButtonText2,
          heroButtonLink2: data.heroButtonLink2,
          stat1Value: data.stat1Value,
          stat1Label: data.stat1Label,
          stat2Value: data.stat2Value,
          stat2Label: data.stat2Label,
          stat3Value: data.stat3Value,
          stat3Label: data.stat3Label,
          stat4Value: data.stat4Value,
          stat4Label: data.stat4Label,
          videoUrl: data.videoUrl,
          videoTitle: data.videoTitle,
          partyDescription: data.partyDescription,
        }
      })
      return NextResponse.json({ success: true, config })
    } else {
      const config = await db.siteConfig.create({
        data: {
          heroImage: data.heroImage || null,
          heroBadge: data.heroBadge || null,
          heroTitle: data.heroTitle || null,
          heroSubtitle: data.heroSubtitle || null,
          heroButtonText1: data.heroButtonText1 || null,
          heroButtonLink1: data.heroButtonLink1 || null,
          heroButtonText2: data.heroButtonText2 || null,
          heroButtonLink2: data.heroButtonLink2 || null,
          stat1Value: data.stat1Value || null,
          stat1Label: data.stat1Label || null,
          stat2Value: data.stat2Value || null,
          stat2Label: data.stat2Label || null,
          stat3Value: data.stat3Value || null,
          stat3Label: data.stat3Label || null,
          stat4Value: data.stat4Value || null,
          stat4Label: data.stat4Label || null,
          videoUrl: data.videoUrl || null,
          videoTitle: data.videoTitle || null,
          partyDescription: data.partyDescription || null,
        }
      })
      return NextResponse.json({ success: true, config })
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
