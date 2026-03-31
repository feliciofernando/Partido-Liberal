import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

// GET - Listar subscritores
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Erro ao buscar subscritores:', error)
    return NextResponse.json({ subscribers: [] })
  }
}

// DELETE - Apagar subscritor
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

    await db.subscriber.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar subscritor:', error)
    return NextResponse.json({ error: 'Erro ao apagar subscritor' }, { status: 500 })
  }
}
