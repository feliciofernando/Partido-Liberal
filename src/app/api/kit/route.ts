import { NextResponse } from 'next/server'
import { supabasePublicQuery } from '@/lib/supabase-public'

// GET - Listar kit items públicos
export async function GET() {
  try {
    const data = await supabasePublicQuery('KitItem?active=eq.true&select=*&order=createdAt.desc')
    return NextResponse.json({ items: data || [] })
  } catch (error) {
    console.error('Erro ao buscar kit items:', error)
    return NextResponse.json({ items: [] })
  }
}
