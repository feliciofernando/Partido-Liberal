import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders, supabasePublicQuery } from '@/lib/supabase-public'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

// GET - Get subscriber count
export async function GET() {
  try {
    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'count=exact',
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Subscriber?select=id`, { headers })
    const count = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error)
    return NextResponse.json({ count: 0 })
  }
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Newsletter signup request:', body)

    if (!body.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const headers = {
      ...getSupabaseHeaders(),
      'Prefer': 'return=representation',
    }

    // Check if email already exists
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/Subscriber?email=eq.${encodeURIComponent(body.email)}&select=id,active`, { headers })

    if (checkRes.ok) {
      const existing = await checkRes.json()
      if (existing && existing.length > 0) {
        if (existing[0].active) {
          return NextResponse.json({
            success: true,
            message: 'Este email já está inscrito na nossa newsletter!'
          })
        } else {
          // Reactivate subscription
          await fetch(`${SUPABASE_URL}/rest/v1/Subscriber?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            headers: { ...getSupabaseHeaders(), 'Prefer': 'return=minimal' },
            body: JSON.stringify({ active: true }),
          })
          return NextResponse.json({
            success: true,
            message: 'Sua inscrição foi reativada com sucesso!'
          })
        }
      }
    }

    // Create new subscriber
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Subscriber`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: body.email,
        name: body.name || null,
        active: true,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Erro ao inscrever:', errorText)

      if (errorText.includes('unique') || errorText.includes('duplicate') || res.status === 409) {
        return NextResponse.json({
          success: true,
          message: 'Este email já está inscrito na nossa newsletter!'
        })
      }

      return NextResponse.json({
        error: 'Erro ao realizar inscrição. Tente novamente.'
      }, { status: 500 })
    }

    const created = await res.json()
    console.log('Subscriber created:', created)

    return NextResponse.json({
      success: true,
      subscriber: created[0] || created,
      message: 'Inscrição realizada com sucesso! Você receberá nossas novidades em breve.'
    })
  } catch (error: any) {
    console.error('Erro ao inscrever:', error)

    return NextResponse.json({
      error: 'Erro ao realizar inscrição. Tente novamente.',
      details: error.message
    }, { status: 500 })
  }
}
