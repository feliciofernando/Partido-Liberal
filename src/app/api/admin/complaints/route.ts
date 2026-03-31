import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar denúncias
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const complaints = await db.complaint.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ complaints })
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error)
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

    const updateData: Record<string, any> = {}

    if (data.status !== undefined) updateData.status = data.status
    if (data.response !== undefined) updateData.response = data.response

    const complaint = await db.complaint.update({
      where: { id: data.id },
      data: updateData
    })

    return NextResponse.json({ success: true, complaint })
  } catch (error) {
    console.error('Erro ao atualizar denúncia:', error)
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

    await db.complaint.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao apagar denúncia' }, { status: 500 })
  }
}
