import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

// GET - Listar alertas
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const alerts = await supabaseRequest('Alert', {
      query: '?select=*&order=createdAt.desc',
    })
    return NextResponse.json({ alerts: alerts || [] })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json({ alerts: [] })
  }
}

// POST - Criar alerta
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    const body = {
      title: data.title,
      message: data.message || null,
      type: data.type || 'info',
      active: data.active ?? true,
    }

    const result = await supabaseRequest('Alert', {
      method: 'POST',
      body,
    })

    const alert = result?.[0] || body
    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Erro ao criar alerta:', error)
    return NextResponse.json({ error: 'Erro ao criar alerta' }, { status: 500 })
  }
}

// PUT - Atualizar alerta
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
    if (data.message !== undefined) updateData.message = data.message
    if (data.type !== undefined) updateData.type = data.type
    if (data.active !== undefined) updateData.active = data.active

    const result = await supabaseRequest('Alert', {
      method: 'PATCH',
      body: updateData,
      query: `?id=eq.${data.id}`,
    })

    const alert = result?.[0] || { ...updateData, id: data.id }
    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error)
    return NextResponse.json({ error: 'Erro ao atualizar alerta' }, { status: 500 })
  }
}

// DELETE - Apagar alerta
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Alert', {
      method: 'DELETE',
      query: `?id=eq.${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar alerta:', error)
    return NextResponse.json({ error: 'Erro ao apagar alerta' }, { status: 500 })
  }
}
