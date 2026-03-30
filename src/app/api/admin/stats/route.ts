import { NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

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
      supabaseRequest('News', { query: '?select=id' }).catch(() => []),
      supabaseRequest('Leader', { query: '?select=id' }).catch(() => []),
      supabaseRequest('Event', { query: '?select=id' }).catch(() => []),
      supabaseRequest('Volunteer', { query: '?select=id' }).catch(() => []),
      supabaseRequest('Volunteer', { query: '?select=id&status=eq.pendente' }).catch(() => []),
      supabaseRequest('Complaint', { query: '?select=id' }).catch(() => []),
      supabaseRequest('Complaint', { query: '?select=id&status=eq.pendente' }).catch(() => []),
      supabaseRequest('Subscriber', { query: '?select=id&active=eq.true' }).catch(() => []),
      supabaseRequest('KitItem', { query: '?select=id&active=eq.true' }).catch(() => []),
      supabaseRequest('Alert', { query: '?select=id&active=eq.true' }).catch(() => []),
    ])

    return NextResponse.json({
      stats: {
        news: news?.length || 0,
        leaders: leaders?.length || 0,
        events: events?.length || 0,
        volunteers: volunteers?.length || 0,
        pendingVolunteers: pendingVolunteers?.length || 0,
        complaints: complaints?.length || 0,
        pendingComplaints: pendingComplaints?.length || 0,
        subscribers: subscribers?.length || 0,
        kitItems: kitItems?.length || 0,
        activeAlerts: alerts?.length || 0,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      stats: {
        news: 0, leaders: 0, events: 0, volunteers: 0, pendingVolunteers: 0,
        complaints: 0, pendingComplaints: 0, subscribers: 0, kitItems: 0, activeAlerts: 0
      },
      error: error.message
    })
  }
}
