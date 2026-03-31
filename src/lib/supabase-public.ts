// Helper para Supabase REST API - Rotas públicas (server-side)
// Usa a SERVICE_ROLE_KEY para acessar dados independentemente do RLS
// Não expor ao cliente!

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function getSupabaseHeaders(): Record<string, string> {
  return {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function supabasePublicQuery(table: string, query: string = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`
  const response = await fetch(url, {
    headers: getSupabaseHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`Supabase public error (${table}):`, error)
    return []
  }

  const text = await response.text()
  return text ? JSON.parse(text) : []
}

export async function supabasePublicGetOne(table: string, query: string = '') {
  const data = await supabasePublicQuery(table, query)
  return data?.[0] || null
}

export async function supabasePublicPatch(table: string, id: string, body: Record<string, any>) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...getSupabaseHeaders(),
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  })
  return response.ok
}
