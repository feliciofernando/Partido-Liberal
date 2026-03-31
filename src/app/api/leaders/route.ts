import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Listar líderes públicos (ativos)
export async function GET() {
  try {
    const leaders = await db.leader.findMany({
      where: { active: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ leaders })
  } catch (error) {
    console.error('Erro ao buscar líderes:', error)
    return NextResponse.json({ leaders: [] })
  }
}
