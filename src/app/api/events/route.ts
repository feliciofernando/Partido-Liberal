import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const headers = {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
    }

    let query = 'select=*&order=date.asc&limit=10'
    if (upcoming === 'true') {
      query = 'date=gte.' + new Date().toISOString().split('T')[0] + '&status=neq.cancelado&select=*&order=date.asc&limit=10'
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/Event?${query}`, {
      headers,
      cache: 'no-store',
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({ events: data || [] })
    }
    return NextResponse.json({ events: [] })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json({ events: [] })
  }
}
