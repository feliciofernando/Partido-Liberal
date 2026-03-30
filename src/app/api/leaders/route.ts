import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET - Listar líderes públicos (ativos)
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/Leader?active=eq.true&select=*&order=order.asc,createdAt.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      console.error('Erro ao buscar líderes do Supabase')
      return NextResponse.json({ leaders: [] })
    }

    const leaders = await res.json()
    return NextResponse.json({ leaders })
  } catch (error) {
    console.error('Erro ao buscar líderes:', error)
    return NextResponse.json({ leaders: [] })
  }
}
