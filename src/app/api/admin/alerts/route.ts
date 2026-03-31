import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar alertas
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const alerts = await db.alert.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
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
    
    const alert = await db.alert.create({
      data: {
        title: data.title,
        message: data.message || null,
        type: data.type || 'info',
        active: data.active ?? true,
      }
    })

    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Erro ao criar alerta:', error)
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

    const updateData: Record<string, any> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.message !== undefined) updateData.message = data.message
    if (data.type !== undefined) updateData.type = data.type
    if (data.active !== undefined) updateData.active = data.active

    const alert = await db.alert.update({
      where: { id: data.id },
      data: updateData
    })

    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error)
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

    await db.alert.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar alerta:', error)
    return NextResponse.json({ error: 'Erro ao apagar alerta' }, { status: 500 })
  }
}
