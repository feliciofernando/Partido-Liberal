import { NextRequest, NextResponse } from 'next/server'
import { checkAuth, supabaseRequest } from '@/lib/supabase-admin'

// GET - Listar subscritores
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const subscribers = await supabaseRequest('Subscriber', {
      query: '?select=*&order=createdAt.desc',
    })
    return NextResponse.json({ subscribers: subscribers || [] })
  } catch (error) {
    console.error('Erro ao buscar subscritores:', error)
    return NextResponse.json({ subscribers: [] })
  }
}

// DELETE - Apagar subscritor
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await supabaseRequest('Subscriber', {
      method: 'DELETE',
      query: `?id=eq.${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar subscritor:', error)
    return NextResponse.json({ error: 'Erro ao apagar subscritor' }, { status: 500 })
  }
}
