import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Gerar slug a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

// GET - Listar posts
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/News?select=*&order=createdAt.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro Supabase:', error)
      return NextResponse.json({ posts: [] })
    }

    const posts = await res.json()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json({ posts: [] })
  }
}

// POST - Criar post
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    // Se está marcando como destaque, remover destaque de todas as outras
    if (data.featured === true) {
      await fetch(`${SUPABASE_URL}/rest/v1/News?featured=eq.true`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: false }),
      })
    }

    const post = {
      id: uuidv4(),
      title: data.title.trim(),
      slug: generateSlug(data.title),
      content: data.content || '',
      summary: data.summary || '',
      image: data.image || null,
      category: data.category || 'politica',
      published: data.published ?? true,
      featured: data.featured ?? false,
      author: data.author || null,
      views: 0,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/News?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(post),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro ao criar post:', error)
      return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, post: created[0] || post })
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}

// PUT - Atualizar post
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    // Se está marcando como destaque, remover destaque de todas as outras primeiro
    if (data.featured === true) {
      await fetch(`${SUPABASE_URL}/rest/v1/News?featured=eq.true`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: false }),
      })
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }

    if (data.title !== undefined) {
      updateData.title = data.title.trim()
      updateData.slug = generateSlug(data.title)
    }
    if (data.content !== undefined) updateData.content = data.content
    if (data.summary !== undefined) updateData.summary = data.summary
    if (data.image !== undefined) updateData.image = data.image || null
    if (data.category !== undefined) updateData.category = data.category
    if (data.published !== undefined) updateData.published = data.published
    if (data.featured !== undefined) updateData.featured = data.featured
    if (data.author !== undefined) updateData.author = data.author || null

    const res = await fetch(`${SUPABASE_URL}/rest/v1/News?id=eq.${data.id}&select=*`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(updateData),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro ao atualizar post:', error)
      return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, post: updated[0] })
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
  }
}

// DELETE - Apagar post
export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/News?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro ao apagar post:', error)
      return NextResponse.json({ error: 'Erro ao apagar post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar post:', error)
    return NextResponse.json({ error: 'Erro ao apagar post' }, { status: 500 })
  }
}
