import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List public news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (slug) {
      // Buscar notícia específica por slug
      const news = await db.news.findFirst({
        where: { slug, published: true }
      })

      if (news) {
        // Incrementar views
        await db.news.update({
          where: { id: news.id },
          data: { views: news.views + 1 }
        })
      }

      return NextResponse.json({ news })
    }

    // Listar todas as notícias publicadas, ordenando featured primeiro
    const news = await db.news.findMany({
      where: { published: true },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    })

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json({ news: [] })
  }
}
