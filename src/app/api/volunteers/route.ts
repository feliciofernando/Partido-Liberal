import { NextRequest, NextResponse } from 'next/server'

// GET - Get volunteer stats
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const headers = {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Prefer': 'count=exact',
    }

    const [totalRes, fiscalsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/volunteer?status=neq.rejeitado&select=id`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/volunteer?isFiscal=eq.true&status=neq.rejeitado&select=id`, { headers }),
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const headers: Record<string, string> = {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/volunteer`, {
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
