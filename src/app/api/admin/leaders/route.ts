import { NextRequest, NextResponse } from 'next/server'
import { supabaseRequest, checkAuth, generateSlug } from '@/lib/supabase-admin'

// GET - Listar líderes
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const leaders = await supabaseRequest('Leader', { query: '?select=*&order=order.asc' })
    return NextResponse.json({ leaders })
  } catch (error) {
    console.error('Erro ao buscar líderes:', error)
    return NextResponse.json({ leaders: [] })
  }
}

// POST - Criar líder
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    const result = await supabaseRequest('Leader', {
      method: 'POST',
      body: {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        role: data.role,
        province: data.province || null,
        bio: data.bio || null,
        photo: data.photo || null,
        proposals: data.proposals || null,
        socialFacebook: data.socialFacebook || null,
        socialTwitter: data.socialTwitter || null,
        socialInstagram: data.socialInstagram || null,
        socialLinkedin: data.socialLinkedin || null,
        order: data.order || 0,
        active: data.active ?? true,
      }
    })

    const leader = result[0]

    return NextResponse.json({ success: true, leader })
  } catch (error: any) {
    console.error('Erro ao criar líder:', error)

    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'Já existe um líder com este slug' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao criar líder' }, { status: 500 })
  }
}

// PUT - Atualizar líder
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.role !== undefined) updateData.role = data.role
    if (data.province !== undefined) updateData.province = data.province
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.photo !== undefined) updateData.photo = data.photo
    if (data.proposals !== undefined) updateData.proposals = data.proposals
    if (data.socialFacebook !== undefined) updateData.socialFacebook = data.socialFacebook
    if (data.socialTwitter !== undefined) updateData.socialTwitter = data.socialTwitter
    if (data.socialInstagram !== undefined) updateData.socialInstagram = data.socialInstagram
    if (data.socialLinkedin !== undefined) updateData.socialLinkedin = data.socialLinkedin
    if (data.order !== undefined) updateData.order = data.order
    if (data.active !== undefined) updateData.active = data.active

    const result = await supabaseRequest('Leader', {
      method: 'PATCH',
      query: `?id=eq.${data.id}`,
      body: updateData
    })

    const leader = result[0]

    return NextResponse.json({ success: true, leader })
  } catch (error) {
    console.error('Erro ao atualizar líder:', error)
    return NextResponse.json({ error: 'Erro ao atualizar líder' }, { status: 500 })
  }
}

// DELETE - Apagar líder
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Leader', {
      method: 'DELETE',
      query: `?id=eq.${id}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar líder:', error)
    return NextResponse.json({ error: 'Erro ao apagar líder' }, { status: 500 })
  }
}
