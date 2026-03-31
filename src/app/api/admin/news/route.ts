import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/supabase-admin'

// GET - Listar notícias
export async function GET(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const news = await db.news.findUnique({
        where: { id }
      })
      return NextResponse.json({ news })
    }

    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ news })
  } catch (error: any) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json({ news: [], error: error.message }, { status: 500 })
  }
}

// POST - Criar notícia
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const news = await db.news.create({
      data: {
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

    return NextResponse.json({ success: true, news })
  } catch (error: any) {
    console.error('Erro ao criar notícia:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe uma notícia com este slug' }, { status: 400 })
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar notícia
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const updateData: Record<string, any> = { ...data }
    if (data.title) {
      updateData.slug = data.slug || generateSlug(data.title)
    }

    const news = await db.news.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, news })
  } catch (error: any) {
    console.error('Erro ao atualizar notícia:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Apagar notícia
export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    await db.news.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao apagar notícia:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
