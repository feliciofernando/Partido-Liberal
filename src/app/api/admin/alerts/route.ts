import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Listar alertas
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Alert?select=*&order=createdAt.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ alerts: [] })
    }

    const alerts = await res.json()
    return NextResponse.json({ alerts })
  } catch {
    return NextResponse.json({ alerts: [] })
  }
}

// POST - Criar alerta
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    // Se está ativando, desativar outros alertas ativos
    if (data.active === true) {
      await fetch(`${SUPABASE_URL}/rest/v1/Alert?active=eq.true`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false }),
      })
    }

    const alert = {
      id: uuidv4(),
      title: data.title.trim(),
      message: data.message || '',
      type: data.type || 'info',
      active: data.active ?? true,
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Alert?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(alert),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao criar alerta' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, alert: created[0] || alert })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar alerta' }, { status: 500 })
  }
}

// PUT - Atualizar alerta
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    // Se está ativando, desativar outros alertas
    if (data.active === true) {
      await fetch(`${SUPABASE_URL}/rest/v1/Alert?active=eq.true`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false }),
      })
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = data.title.trim()
    if (data.message !== undefined) updateData.message = data.message
    if (data.type !== undefined) updateData.type = data.type
    if (data.active !== undefined) updateData.active = data.active

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Alert?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar alerta' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, alert: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar alerta' }, { status: 500 })
  }
}

// DELETE - Apagar alerta
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Alert?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar alerta' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar alerta' }, { status: 500 })
  }
}
