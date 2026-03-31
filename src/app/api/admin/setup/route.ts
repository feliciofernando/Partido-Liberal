import { NextResponse } from 'next/server'
import { supabaseRequest } from '@/lib/supabase-admin'

// API para verificar o banco de dados via Supabase
export async function GET() {
  const results: Record<string, string> = {}

  try {
    const tables = [
      'News',
      'Leader',
      'Event',
      'Volunteer',
      'Complaint',
      'GovernmentProgram',
      'KitItem',
      'Alert',
      'Subscriber',
    ]

    for (const table of tables) {
      try {
        await supabaseRequest(table, {
          query: '?select=id&limit=1',
        })
        results[table] = '✅ OK'
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro'
        results[table] = `❌ ${message.substring(0, 50)}`
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    results.error = message
  }

  return NextResponse.json({
    message: 'Verificação do banco de dados (Supabase)',
    results,
    instructions: 'Se houver tabelas com erro, execute o SQL no Supabase SQL Editor',
  })
}
