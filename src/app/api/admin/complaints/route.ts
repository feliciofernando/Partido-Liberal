import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Listar denúncias
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Complaint?select=*&order=createdAt.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ complaints: [] })
    }

    const complaints = await res.json()
    return NextResponse.json({ complaints })
  } catch {
    return NextResponse.json({ complaints: [] })
  }
}

// PUT - Atualizar denúncia (responder)
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

    if (data.status !== undefined) updateData.status = data.status
    if (data.response !== undefined) updateData.response = data.response

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Complaint?id=eq.${data.id}&select=*`, {
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
      return NextResponse.json({ error: 'Erro ao atualizar denúncia' }, { status: 500 })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, complaint: updated[0] })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar denúncia' }, { status: 500 })
  }
}

// DELETE - Apagar denúncia
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Complaint?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao apagar denúncia' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao apagar denúncia' }, { status: 500 })
  }
}
