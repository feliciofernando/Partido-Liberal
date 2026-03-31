import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Listar kit items públicos
export async function GET() {
  try {
    const items = await db.kitItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Erro ao buscar kit items:', error)
    return NextResponse.json({ items: [] })
  }
}
