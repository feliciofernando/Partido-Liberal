import { NextRequest, NextResponse } from 'next/server'
import { supabaseRequest, checkAuth } from '@/lib/supabase-admin'

// GET - Listar configurações
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const result = await supabaseRequest('SiteConfig', { query: '?select=*&limit=1' })
    const config = result?.[0] || null
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ config: null })
  }
}

// PUT - Salvar configurações
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    // Verificar se já existe configuração
    const existing = await supabaseRequest('SiteConfig', { query: '?select=id&limit=1' })
    const existingId = existing?.[0]?.id

    const configData = {
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
      openrouterApiKey: data.openrouterApiKey || null,
    }

    let config

    if (existingId) {
      const result = await supabaseRequest('SiteConfig', {
        method: 'PATCH',
        query: `?id=eq.${existingId}`,
        body: configData
      })
      config = result[0]
    } else {
      const result = await supabaseRequest('SiteConfig', {
        method: 'POST',
        body: configData
      })
      config = result[0]
    }

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
