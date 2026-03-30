// Helper para Supabase REST API
import { getAdminSession } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function checkAuth() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null
}

export async function supabaseRequest(table: string, options: {
  method?: string
  body?: any
  query?: string
} = {}) {
  const { method = 'GET', body, query = '' } = options
  
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`
  
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
