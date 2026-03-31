import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar voluntários
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const volunteers = await db.volunteer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ volunteers })
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error)
    return NextResponse.json({ volunteers: [] })
  }
}

// PUT - Atualizar voluntário
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}

    if (data.status !== undefined) updateData.status = data.status
    if (data.isFiscal !== undefined) updateData.isFiscal = data.isFiscal

    const volunteer = await db.volunteer.update({
      where: { id: data.id },
      data: updateData
    })

    return NextResponse.json({ success: true, volunteer })
  } catch (error) {
    console.error('Erro ao atualizar voluntário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar voluntário' }, { status: 500 })
  }
}

// DELETE - Apagar voluntário
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

    await db.volunteer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar voluntário:', error)
    return NextResponse.json({ error: 'Erro ao apagar voluntário' }, { status: 500 })
  }
}
