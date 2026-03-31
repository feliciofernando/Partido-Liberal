import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders, supabasePublicQuery } from '@/lib/supabase-public'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

// GET - Get complaint count
export async function GET() {
  try {
    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'count=exact',
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Complaint?select=id`, { headers })
    const count = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error)
    return NextResponse.json({ count: 0 })
  }
}

// POST - Create complaint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.type) {
      return NextResponse.json({ error: 'Selecione o tipo de mensagem' }, { status: 400 })
    }
    if (!body.subject) {
      return NextResponse.json({ error: 'Assunto é obrigatório' }, { status: 400 })
    }
    if (!body.message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'return=representation',
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Complaint`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: body.type,
        name: body.anonymous ? null : (body.name || null),
        email: body.anonymous ? null : (body.email || null),
        phone: body.anonymous ? null : (body.phone || null),
        province: body.province || null,
        subject: body.subject,
        message: body.message,
        anonymous: body.anonymous || false,
        status: 'pendente',
      }),
    })

    if (!res.ok) {
      console.error('Erro ao registrar denúncia')
      return NextResponse.json({ error: 'Erro ao registrar mensagem. Tente novamente.' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({
      success: true,
      complaint: created[0] || created,
      message: 'Mensagem enviada com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao registrar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao registrar mensagem. Tente novamente.' }, { status: 500 })
  }
}
