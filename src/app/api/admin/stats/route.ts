import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    // Buscar contagens em paralelo
    const [
      news,
      leaders,
      events,
      volunteers,
      pendingVolunteers,
      complaints,
      pendingComplaints,
      subscribers,
      kitItems,
      alerts
    ] = await Promise.all([
      db.news.count().catch(() => 0),
      db.leader.count().catch(() => 0),
      db.event.count().catch(() => 0),
      db.volunteer.count().catch(() => 0),
      db.volunteer.count({ where: { status: 'pendente' } }).catch(() => 0),
      db.complaint.count().catch(() => 0),
      db.complaint.count({ where: { status: 'pendente' } }).catch(() => 0),
      db.subscriber.count({ where: { active: true } }).catch(() => 0),
      db.kitItem.count({ where: { active: true } }).catch(() => 0),
      db.alert.count({ where: { active: true } }).catch(() => 0),
    ])

    return NextResponse.json({
      stats: {
        news,
        leaders,
        events,
        volunteers,
        pendingVolunteers,
        complaints,
        pendingComplaints,
        subscribers,
        kitItems,
        activeAlerts: alerts,
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({
      stats: {
        news: 0, leaders: 0, events: 0, volunteers: 0, pendingVolunteers: 0,
        complaints: 0, pendingComplaints: 0, subscribers: 0, kitItems: 0, activeAlerts: 0
      },
      error: error.message
    })
  }
}
