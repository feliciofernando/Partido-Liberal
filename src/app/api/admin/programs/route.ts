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

// GET - Listar programas
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/GovernmentProgram?select=*&order=order.asc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ programs: [] })
    }

    const programs = await res.json()
    return NextResponse.json({ programs })
  } catch {
    return NextResponse.json({ programs: [] })
  }
}

// POST - Criar programa
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    const program = {
      id: uuidv4(),
      title: data.title.trim(),
      slug: generateSlug(data.title),
      area: data.area || '',
      summary: data.summary || '',
      content: data.content || '',
      icon: data.icon || null,
      order: data.order || 0,
      active: data.active ?? true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/GovernmentProgram?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(program),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao criar programa' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, program: created[0] || program })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar programa' }, { status: 500 })
  }
}

// PUT - Atualizar programa
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
    if (data.area !== undefined) updateData.area = data.area
    if (data.summary !== undefined) updateData.summary = data.summary
    if (data.content !== undefined) updateData.content = data.content
    if (data.icon !== undefined) updateData.icon = data.icon || null
    if (data.order !== undefined) updateData.order = data.order
    if (data.active !== undefined) updateData.active = data.active

    const res = await fetch(`${SUPABASE_URL}/rest/v1/GovernmentProgram?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar programa' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, program: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar programa' }, { status: 500 })
  }
}

// DELETE - Apagar programa
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/GovernmentProgram?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar programa' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar programa' }, { status: 500 })
  }
}
