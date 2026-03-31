import { NextResponse } from 'next/server'
import { supabasePublicQuery } from '@/lib/supabase-public'

export async function GET() {
  try {
    const data = await supabasePublicQuery('Leader?active=eq.true&select=*&order=order.asc,createdAt.desc')
    return NextResponse.json({ leaders: data || [] })
  } catch (error) {
    console.error('Erro ao buscar líderes:', error)
    return NextResponse.json({ leaders: [] })
  }
}
