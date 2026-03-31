import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET - List public news (from Supabase)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (slug) {
      // Buscar notícia específica por slug
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/News?slug=eq.${slug}&published=eq.true&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          cache: 'no-store',
        }
      )

      if (!res.ok) {
        return NextResponse.json({ news: null })
      }

      const data = await res.json()
      const news = data[0]

      if (news) {
        // Incrementar views (usando service role para escrita)
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        await fetch(
          `${SUPABASE_URL}/rest/v1/News?id=eq.${news.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ views: (news.views || 0) + 1 }),
          }
        )
      }

      return NextResponse.json({ news })
    }

    // Listar todas as notícias publicadas, ordenando featured primeiro
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/News?published=eq.true&select=*&order=featured.desc,createdAt.desc&limit=${limit}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      console.error('Erro ao buscar notícias do Supabase')
      return NextResponse.json({ news: [] })
    }

    const news = await res.json()
    return NextResponse.json({ news })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json({ news: [] })
  }
}
