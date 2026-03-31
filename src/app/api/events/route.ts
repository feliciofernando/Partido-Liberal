import { NextRequest, NextResponse } from 'next/server'
import { supabasePublicQuery } from '@/lib/supabase-public'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming')

    let query = 'select=*&order=date.asc&limit=10'
    if (upcoming === 'true') {
      query = 'date=gte.' + new Date().toISOString().split('T')[0] + '&status=neq.cancelado&select=*&order=date.asc&limit=10'
    }

    const data = await supabasePublicQuery(`Event?${query}`)
    return NextResponse.json({ events: data || [] })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json({ events: [] })
  }
}
