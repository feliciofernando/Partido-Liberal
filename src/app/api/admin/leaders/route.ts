import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

// GET - Listar líderes
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Leader?select=*&order=order.asc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ leaders: [] })
    }

    const leaders = await res.json()
    return NextResponse.json({ leaders })
  } catch {
    return NextResponse.json({ leaders: [] })
  }
}

// POST - Criar líder
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.name?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const leader = {
      id: uuidv4(),
      name: data.name.trim(),
      slug: generateSlug(data.name),
      role: data.role || 'Membro',
      province: data.province || null,
      bio: data.bio || '',
      photo: data.photo || null,
      proposals: data.proposals || null,
      socialFacebook: data.socialFacebook || null,
      socialTwitter: data.socialTwitter || null,
      socialInstagram: data.socialInstagram || null,
      socialLinkedin: data.socialLinkedin || null,
      order: data.order || 0,
      active: data.active ?? true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Leader?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(leader),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao criar líder' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, leader: created[0] || leader })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar líder' }, { status: 500 })
  }
}

// PUT - Atualizar líder
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

    if (data.name !== undefined) {
      updateData.name = data.name.trim()
      updateData.slug = generateSlug(data.name)
    }
    if (data.role !== undefined) updateData.role = data.role
    if (data.province !== undefined) updateData.province = data.province || null
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.photo !== undefined) updateData.photo = data.photo || null
    if (data.proposals !== undefined) updateData.proposals = data.proposals
    if (data.socialFacebook !== undefined) updateData.socialFacebook = data.socialFacebook || null
    if (data.socialTwitter !== undefined) updateData.socialTwitter = data.socialTwitter || null
    if (data.socialInstagram !== undefined) updateData.socialInstagram = data.socialInstagram || null
    if (data.socialLinkedin !== undefined) updateData.socialLinkedin = data.socialLinkedin || null
    if (data.order !== undefined) updateData.order = data.order
    if (data.active !== undefined) updateData.active = data.active

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Leader?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar líder' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, leader: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar líder' }, { status: 500 })
  }
}

// DELETE - Apagar líder
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Leader?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar líder' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar líder' }, { status: 500 })
  }
}
