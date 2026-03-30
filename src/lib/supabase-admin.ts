// Helper para Supabase REST API
import { checkAuth as authCheck } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Verificar autenticação
export async function checkAuth() {
  const isAuthenticated = await authCheck()
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null
}

// Fazer requisição ao Supabase
export async function supabaseRequest(table: string, options: {
  method?: string
  body?: any
  query?: string
} = {}) {
  const { method = 'GET', body, query = '' } = options

  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`

  const headers: Record<string, string> = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }

  if (method !== 'GET') {
    headers['Prefer'] = 'return=representation'
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`Supabase error (${table}):`, error)
    throw new Error(`Database error: ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// Gerar slug a partir do texto
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
