import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar kit items
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const items = await db.kitItem.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Erro ao buscar kit items:', error)
    return NextResponse.json({ items: [] })
  }
}

// POST - Criar kit item
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const item = await db.kitItem.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type || 'documento',
        fileUrl: data.fileUrl || null,
        thumbnail: data.thumbnail || null,
        downloads: 0,
        active: data.active ?? true,
      }
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Erro ao criar kit item:', error)
    return NextResponse.json({ error: 'Erro ao criar kit item' }, { status: 500 })
  }
}

// PUT - Atualizar kit item
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.downloads !== undefined) updateData.downloads = data.downloads
    if (data.active !== undefined) updateData.active = data.active

    const item = await db.kitItem.update({
      where: { id: data.id },
      data: updateData
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Erro ao atualizar kit item:', error)
    return NextResponse.json({ error: 'Erro ao atualizar kit item' }, { status: 500 })
  }
}

// DELETE - Apagar kit item
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

    await db.kitItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar kit item:', error)
    return NextResponse.json({ error: 'Erro ao apagar kit item' }, { status: 500 })
  }
}
