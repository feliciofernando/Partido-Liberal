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

    const complaint = await db.complaint.create({
      data: {
        type: body.type,
        name: body.name || null,
        email: body.email || null,
        phone: body.phone || null,
        province: body.province || null,
        subject: body.subject,
        message: body.message,
        anonymous: body.anonymous || false,
        status: 'pendente',
      }
    })

    return NextResponse.json({ success: true, complaint })
  } catch (error) {
    console.error('Erro ao registrar denúncia:', error)
    return NextResponse.json({ error: 'Erro ao registrar denúncia' }, { status: 500 })
  }
}
