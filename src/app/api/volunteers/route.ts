import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get volunteer count
export async function GET() {
  try {
    const count = await db.volunteer.count({
      where: { status: { not: 'rejeitado' } }
    })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error)
    return NextResponse.json({ count: 0 })
  }
}

// POST - Create volunteer registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const volunteer = await db.volunteer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        province: body.province,
        municipality: body.municipality || null,
        availability: body.availability || null,
        interests: body.interests || null,
        experience: body.experience || null,
        isFiscal: body.isFiscal || false,
        status: 'pendente',
      }
    })

    return NextResponse.json({ success: true, volunteer })
  } catch (error: any) {
    console.error('Erro ao registrar voluntário:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Erro ao registrar voluntário' }, { status: 500 })
  }
}
