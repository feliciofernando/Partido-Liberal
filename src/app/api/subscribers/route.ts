import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const subscriber = await db.subscriber.create({
      data: {
        email: body.email,
        name: body.name || null,
        active: true,
      }
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error: any) {
    console.error('Erro ao inscrever:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Erro ao inscrever' }, { status: 500 })
  }
}
