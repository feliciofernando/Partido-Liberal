import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders } from '@/lib/supabase-public'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

// GET - Get volunteer stats
export async function GET() {
  try {
    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'count=exact',
    }

    const [totalRes, fiscalsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/volunteer?status=neq.rejeitado&select=id`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/volunteer?isFiscal=eq.true&status=neq.rejeitado&select=id`, { headers }),
    ])

    const total = parseInt(totalRes.headers.get('content-range')?.split('/')[1] || '0')
    const fiscals = parseInt(fiscalsRes.headers.get('content-range')?.split('/')[1] || '0')

    return NextResponse.json({
      stats: {
        total: parseInt(total) + 15000,
        fiscals: parseInt(fiscals) + 3850,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error)
    return NextResponse.json({ stats: { total: 15000, fiscals: 3850 } })
  }
}

// POST - Create volunteer registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const interests = Array.isArray(body.interests)
      ? JSON.stringify(body.interests)
      : body.interests || null

    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'return=representation',
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/volunteer`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        province: body.province || null,
        municipality: body.municipality || null,
        availability: body.availability || null,
        interests: interests,
        experience: body.experience || null,
        isFiscal: body.isFiscal || false,
        status: 'pendente',
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro ao registrar voluntário:', error)
      return NextResponse.json({ error: 'Erro ao registrar voluntário. Tente novamente.' }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({
      success: true,
      volunteer: created[0] || created,
      message: 'Cadastro realizado com sucesso!'
    })
  } catch (error: any) {
    console.error('Erro ao registrar voluntário:', error)

    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'Email já cadastrado como voluntário' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao registrar voluntário. Tente novamente.' }, { status: 500 })
  }
}
