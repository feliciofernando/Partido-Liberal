import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

// GET - Listar voluntários
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const volunteers = await supabaseRequest('Volunteer', {
      query: '?select=*&order=createdAt.desc',
    })
    return NextResponse.json({ volunteers: volunteers || [] })
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error)
    return NextResponse.json({ volunteers: [] })
  }
}

// PUT - Atualizar voluntário
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
    if (data.isFiscal !== undefined) updateData.isFiscal = data.isFiscal

    const result = await supabaseRequest('Volunteer', {
      method: 'PATCH',
      body: updateData,
      query: `?id=eq.${data.id}`,
    })

    const volunteer = result?.[0] || { ...updateData, id: data.id }
    return NextResponse.json({ success: true, volunteer })
  } catch (error) {
    console.error('Erro ao atualizar voluntário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar voluntário' }, { status: 500 })
  }
}

// DELETE - Apagar voluntário
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Volunteer', {
      method: 'DELETE',
      query: `?id=eq.${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar voluntário:', error)
    return NextResponse.json({ error: 'Erro ao apagar voluntário' }, { status: 500 })
  }
}
