import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET - Listar kit items públicos
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/KitItem?select=*&active=eq.true&order=createdAt.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }

    const items = await res.json()
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Erro ao buscar kit items:', error)
    return NextResponse.json({ items: [] })
  }
}
