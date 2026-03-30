import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest, generateSlug } from '@/lib/supabase-admin'

// GET
export async function GET(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const data = await supabaseRequest('GovernmentProgram', { query: `?id=eq.${id}&select=*` })
      return NextResponse.json({ program: data?.[0] || null })
    }

    const programs = await supabaseRequest('GovernmentProgram', { query: '?select=*&order=order.asc' })
    return NextResponse.json({ programs: programs || [] })
  } catch (error: any) {
    return NextResponse.json({ programs: [], error: error.message }, { status: 500 })
  }
}

// POST
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    const program = await supabaseRequest('GovernmentProgram', {
      method: 'POST',
      body: {
        title: body.title,
        slug: generateSlug(body.title),
        area: body.area || '',
        summary: body.summary || '',
        content: body.content || '',
        icon: body.icon || null,
        order: body.order || 0,
        active: body.active ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, program: program?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    const program = await supabaseRequest('GovernmentProgram', {
      method: 'PATCH',
      query: `?id=eq.${id}`,
      body: {
        ...data,
        ...(data.title && { slug: generateSlug(data.title) }),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, program: program?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    await supabaseRequest('GovernmentProgram', { method: 'DELETE', query: `?id=eq.${id}` })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
