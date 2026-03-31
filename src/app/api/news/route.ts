import { NextRequest, NextResponse } from 'next/server'
import { supabasePublicQuery, supabasePublicGetOne, supabasePublicPatch } from '@/lib/supabase-public'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (slug) {
      const data = await supabasePublicQuery(`News?slug=eq.${slug}&published=eq.true&select=*`)
      if (data && data.length > 0) {
        // Increment views
        await supabasePublicPatch('News', data[0].id, { views: (data[0].views || 0) + 1 })
        return NextResponse.json({ news: data[0] })
      }
      return NextResponse.json({ news: null })
    }

    // List published news
    const data = await supabasePublicQuery(`News?published=eq.true&select=*&order=featured.desc,createdAt.desc&limit=${limit}`)
    return NextResponse.json({ news: data || [] })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json({ news: [] })
  }
}
