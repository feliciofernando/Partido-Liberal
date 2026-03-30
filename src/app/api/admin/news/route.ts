import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest, generateSlug } from '@/lib/supabase-admin'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const data = await supabaseRequest('News', { query: `?id=eq.${id}&select=*` })
      return NextResponse.json({ news: data?.[0] || null })
    }

    const news = await supabaseRequest('News', { query: '?select=*&order=createdAt.desc' })
    return NextResponse.json({ news: news || [] })
  } catch (error: any) {
    return NextResponse.json({ news: [], error: error.message }, { status: 500 })
  }
}

// POST - Criar notícia
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    
    const news = await supabaseRequest('News', {
      method: 'POST',
      body: {
        title: body.title,
        slug: generateSlug(body.title),
        summary: body.summary || '',
        content: body.content || '',
        image: body.image || null,
        category: body.category || 'politica',
        featured: body.featured || false,
        published: body.published || false,
        author: body.author || null,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, news: news?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar notícia
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const news = await supabaseRequest('News', {
      method: 'PATCH',
      query: `?id=eq.${id}`,
      body: {
        ...data,
        ...(data.title && { slug: generateSlug(data.title) }),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, news: news?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Apagar notícia
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    await supabaseRequest('News', { method: 'DELETE', query: `?id=eq.${id}` })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
