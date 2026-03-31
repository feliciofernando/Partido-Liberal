import { NextRequest, NextResponse } from 'next/server'
import { supabaseRequest, checkAuth, generateSlug } from '@/lib/supabase-admin'

// GET - Listar eventos
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const events = await supabaseRequest('Event', { query: '?select=*&order=date.desc' })
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json({ events: [] })
  }
}

// POST - Criar evento
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    const result = await supabaseRequest('Event', {
      method: 'POST',
      body: {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        description: data.description || null,
        location: data.location || null,
        province: data.province || null,
        date: data.date,
        time: data.time || null,
        image: data.image || null,
        type: data.type || 'outro',
        status: data.status || 'agendado',
        attendees: data.attendees || 0,
      }
    })

    const event = result[0]

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error('Erro ao criar evento:', error)

    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'Já existe um evento com este slug' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}

// PUT - Atualizar evento
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.description !== undefined) updateData.description = data.description
    if (data.location !== undefined) updateData.location = data.location
    if (data.province !== undefined) updateData.province = data.province
    if (data.date !== undefined) updateData.date = data.date
    if (data.time !== undefined) updateData.time = data.time
    if (data.image !== undefined) updateData.image = data.image
    if (data.type !== undefined) updateData.type = data.type
    if (data.status !== undefined) updateData.status = data.status
    if (data.attendees !== undefined) updateData.attendees = data.attendees

    const result = await supabaseRequest('Event', {
      method: 'PATCH',
      query: `?id=eq.${data.id}`,
      body: updateData
    })

    const event = result[0]

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 })
  }
}

// DELETE - Apagar evento
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Event', {
      method: 'DELETE',
      query: `?id=eq.${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar evento:', error)
    return NextResponse.json({ error: 'Erro ao apagar evento' }, { status: 500 })
  }
}
