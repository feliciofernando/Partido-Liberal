import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

// GET - Listar kit items
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const items = await supabaseRequest('KitItem', {
      query: '?select=*&order=createdAt.desc',
    })
    return NextResponse.json({ items: items || [] })
  } catch (error) {
    console.error('Erro ao buscar kit items:', error)
    return NextResponse.json({ items: [] })
  }
}

// POST - Criar kit item
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    const body = {
      title: data.title,
      description: data.description || null,
      type: data.type || 'documento',
      fileUrl: data.fileUrl || null,
      thumbnail: data.thumbnail || null,
      downloads: 0,
      active: data.active ?? true,
    }

    const result = await supabaseRequest('KitItem', {
      method: 'POST',
      body,
    })

    const item = result?.[0] || body
    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Erro ao criar kit item:', error)
    return NextResponse.json({ error: 'Erro ao criar kit item' }, { status: 500 })
  }
}

// PUT - Atualizar kit item
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.downloads !== undefined) updateData.downloads = data.downloads
    if (data.active !== undefined) updateData.active = data.active

    const result = await supabaseRequest('KitItem', {
      method: 'PATCH',
      body: updateData,
      query: `?id=eq.${data.id}`,
    })

    const item = result?.[0] || { ...updateData, id: data.id }
    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Erro ao atualizar kit item:', error)
    return NextResponse.json({ error: 'Erro ao atualizar kit item' }, { status: 500 })
  }
}

// DELETE - Apagar kit item
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('KitItem', {
      method: 'DELETE',
      query: `?id=eq.${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar kit item:', error)
    return NextResponse.json({ error: 'Erro ao apagar kit item' }, { status: 500 })
  }
}
