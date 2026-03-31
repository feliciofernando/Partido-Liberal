import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

// GET - Listar denúncias
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const complaints = await supabaseRequest('Complaint', {
      query: '?select=*&order=createdAt.desc',
    })
    return NextResponse.json({ complaints: complaints || [] })
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error)
    return NextResponse.json({ complaints: [] })
  }
}

// PUT - Atualizar denúncia (responder)
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}

    if (data.status !== undefined) updateData.status = data.status
    if (data.response !== undefined) updateData.response = data.response

    const result = await supabaseRequest('Complaint', {
      method: 'PATCH',
      body: updateData,
      query: `?id=eq.${data.id}`,
    })

    const complaint = result?.[0] || { ...updateData, id: data.id }
    return NextResponse.json({ success: true, complaint })
  } catch (error) {
    console.error('Erro ao atualizar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao atualizar denúncia' }, { status: 500 })
  }
}

// DELETE - Apagar denúncia
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Complaint', {
      method: 'DELETE',
      query: `?id=eq.${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao apagar denúncia' }, { status: 500 })
  }
}
