import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get complaint count
export async function GET() {
  try {
    const count = await db.complaint.count()
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

    // Validate required fields
    if (!body.type) {
      return NextResponse.json({ error: 'Selecione o tipo de mensagem' }, { status: 400 })
    }
    if (!body.subject) {
      return NextResponse.json({ error: 'Assunto é obrigatório' }, { status: 400 })
    }
    if (!body.message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    const complaint = await db.complaint.create({
      data: {
        type: body.type,
        name: body.anonymous ? null : (body.name || null),
        email: body.anonymous ? null : (body.email || null),
        phone: body.anonymous ? null : (body.phone || null),
        province: body.province || null,
        subject: body.subject,
        message: body.message,
        anonymous: body.anonymous || false,
        status: 'pendente',
      }
    })

    return NextResponse.json({ 
      success: true, 
      complaint,
      message: 'Mensagem enviada com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao registrar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao registrar mensagem. Tente novamente.' }, { status: 500 })
  }
}
