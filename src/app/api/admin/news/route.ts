import { NextRequest, NextResponse } from 'next/server'
import { supabaseRequest, checkAuth, generateSlug } from '@/lib/supabase-admin'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const news = await supabaseRequest('News', { query: `?id=eq.${id}&limit=1` })
      return NextResponse.json({ news: news?.[0] || null })
    }

    const news = await supabaseRequest('News', { query: '?select=*&order=createdAt.desc' })
    return NextResponse.json({ news })
  } catch (error: any) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json({ news: [], error: error.message }, { status: 500 })
  }
}

// POST - Criar notícia
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    const result = await supabaseRequest('News', {
      method: 'POST',
      body: {
        title: body.title,
        slug: body.slug || generateSlug(body.title),
        summary: body.summary || null,
        content: body.content || null,
        image: body.image || null,
        category: body.category || 'politica',
        featured: body.featured || false,
        published: body.published || false,
        author: body.author || null,
        views: 0,
      }
    })

    const news = result[0]

    return NextResponse.json({ success: true, news })
  } catch (error: any) {
    console.error('Erro ao criar notícia:', error)

    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'Já existe uma notícia com este slug' }, { status: 400 })
    }

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

    const updateData: Record<string, any> = { ...data }
    if (data.title) {
      updateData.slug = data.slug || generateSlug(data.title)
    }

    const result = await supabaseRequest('News', {
      method: 'PATCH',
      query: `?id=eq.${id}`,
      body: updateData
    })

    const news = result[0]

    return NextResponse.json({ success: true, news })
  } catch (error: any) {
    console.error('Erro ao atualizar notícia:', error)
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

    await supabaseRequest('News', {
      method: 'DELETE',
      query: `?id=eq.${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao apagar notícia:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
