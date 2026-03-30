import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// API para verificar o banco de dados
export async function GET() {
  const results: any = {}

  try {
    // Testar cada tabela
    const tables = [
      { name: 'news', model: db.news },
      { name: 'leaders', model: db.leader },
      { name: 'events', model: db.event },
      { name: 'volunteers', model: db.volunteer },
      { name: 'complaints', model: db.complaint },
      { name: 'programs', model: db.governmentProgram },
      { name: 'kitItems', model: db.kitItem },
      { name: 'alerts', model: db.alert },
      { name: 'subscribers', model: db.subscriber },
    ]

    for (const table of tables) {
      try {
        await table.model.findMany({ take: 1 })
        results[table.name] = '✅ OK'
      } catch (e: any) {
        results[table.name] = `❌ ${e.message?.substring(0, 50) || 'Erro'}`
      }
    }

  } catch (error: any) {
    results.error = error.message
  }

  return NextResponse.json({
    message: 'Verificação do banco de dados',
    results,
    instructions: 'Se houver tabelas com erro, execute o SQL no Supabase SQL Editor'
  })
}
