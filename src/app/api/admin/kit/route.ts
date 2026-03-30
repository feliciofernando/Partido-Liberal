import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Listar kit items
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/KitItem?select=*&order=createdAt.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }

    const items = await res.json()
    return NextResponse.json({ items })
  } catch {
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

    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    const item = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description || '',
      type: data.type || 'documento',
      fileUrl: data.fileUrl || '',
      thumbnail: data.thumbnail || null,
      downloads: 0,
      active: data.active ?? true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/KitItem?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(item),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, item: created[0] || item })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 })
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

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = data.title.trim()
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail || null
    if (data.active !== undefined) updateData.active = data.active

    const res = await fetch(`${SUPABASE_URL}/rest/v1/KitItem?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, item: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/KitItem?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar item' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar item' }, { status: 500 })
  }
}
