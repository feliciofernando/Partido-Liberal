import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get volunteer stats
export async function GET() {
  try {
    const total = await db.volunteer.count({
      where: { status: { not: 'rejeitado' } }
    })
    const fiscals = await db.volunteer.count({
      where: { isFiscal: true, status: { not: 'rejeitado' } }
    })
    return NextResponse.json({ 
      stats: {
        total: total + 15000, // Base count for display
        fiscals: fiscals + 3850 // Base count for display
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

    // Convert interests array to string if needed
    const interests = Array.isArray(body.interests) 
      ? JSON.stringify(body.interests) 
      : body.interests || null

    const volunteer = await db.volunteer.create({
      data: {
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
      }
    })

    return NextResponse.json({ 
      success: true, 
      volunteer,
      message: 'Cadastro realizado com sucesso!'
    })
  } catch (error: any) {
    console.error('Erro ao registrar voluntário:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email já cadastrado como voluntário' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Erro ao registrar voluntário. Tente novamente.' }, { status: 500 })
  }
}
