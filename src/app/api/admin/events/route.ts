import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

// GET - Listar eventos
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Event?select=*&order=date.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ events: [] })
    }

    const events = await res.json()
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ events: [] })
  }
}

// POST - Criar evento
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    const event = {
      id: uuidv4(),
      title: data.title.trim(),
      slug: generateSlug(data.title),
      description: data.description || '',
      location: data.location || '',
      province: data.province || '',
      date: data.date || new Date().toISOString(),
      time: data.time || null,
      image: data.image || null,
      type: data.type || 'outro',
      status: data.status || 'agendado',
      attendees: 0,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Event?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(event),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, event: created[0] || event })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}

// PUT - Atualizar evento
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

    if (data.title !== undefined) {
      updateData.title = data.title.trim()
      updateData.slug = generateSlug(data.title)
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.location !== undefined) updateData.location = data.location
    if (data.province !== undefined) updateData.province = data.province
    if (data.date !== undefined) updateData.date = data.date
    if (data.time !== undefined) updateData.time = data.time || null
    if (data.image !== undefined) updateData.image = data.image || null
    if (data.type !== undefined) updateData.type = data.type
    if (data.status !== undefined) updateData.status = data.status

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Event?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, event: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 })
  }
}

// DELETE - Apagar evento
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Event?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar evento' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar evento' }, { status: 500 })
  }
}
