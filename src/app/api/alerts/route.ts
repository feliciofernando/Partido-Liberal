import { NextResponse } from 'next/server'
import { supabasePublicQuery } from '@/lib/supabase-public'

// GET - Get active alerts
export async function GET() {
  try {
    const data = await supabasePublicQuery('Alert?active=eq.true&select=*&order=createdAt.desc&limit=5')
    return NextResponse.json({ alerts: data || [] })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json({ alerts: [] })
  }
}
