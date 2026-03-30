import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - Listar configurações
export async function GET() {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/SiteConfig?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ config: null })
    }

    const configs = await res.json()
    // Converter array de configs em objeto
    const config: Record<string, string> = {}
    for (const c of configs) {
      config[c.key] = c.value
    }
    return NextResponse.json({ config })
  } catch {
    return NextResponse.json({ config: null })
  }
}

// PUT - Salvar configurações
export async function PUT(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const data = await request.json()

    for (const [key, value] of Object.entries(data)) {
      // Upsert cada configuração
      await fetch(`${SUPABASE_URL}/rest/v1/SiteConfig?on_conflict=key`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          key,
          value: String(value),
          updatedAt: new Date().toISOString(),
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
