import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get active alerts
export async function GET() {
  try {
    const alerts = await db.alert.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json({ alerts: [] })
  }
}
