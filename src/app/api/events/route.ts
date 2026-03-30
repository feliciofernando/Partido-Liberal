import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List public events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming')

    const where: any = {}
    
    if (upcoming === 'true') {
      where.date = { gte: new Date() }
      where.status = { not: 'cancelado' }
    }

    const events = await db.event.findMany({
      where,
      orderBy: { date: 'asc' },
      take: 10,
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json({ events: [] })
  }
}
