import { NextResponse } from 'next/server'
import { supabaseRequest, checkAuth } from '@/lib/supabase-admin'

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
      supabaseRequest('News', { query: '?select=id' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Leader', { query: '?select=id' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Event', { query: '?select=id' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Volunteer', { query: '?select=id' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Volunteer', { query: '?select=id&status=eq.pendente' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Complaint', { query: '?select=id' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Complaint', { query: '?select=id&status=eq.pendente' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Subscriber', { query: '?select=id&active=eq.true' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('KitItem', { query: '?select=id&active=eq.true' }).then(r => r?.length || 0).catch(() => 0),
      supabaseRequest('Alert', { query: '?select=id&active=eq.true' }).then(r => r?.length || 0).catch(() => 0),
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
