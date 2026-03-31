import { NextRequest, NextResponse } from 'next/server'

// Dynamic import to avoid build-time issues
async function getDb() {
  const { db } = await import('@/lib/db')
  return db
}

// GET - Get subscriber count
export async function GET() {
  try {
    const db = await getDb()
    const count = await db.subscriber.count({
      where: { active: true }
    })
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

    // Validate email
    if (!body.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const db = await getDb()

    // Check if email already exists
    const existing = await db.subscriber.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ 
          success: true, 
          message: 'Este email já está inscrito na nossa newsletter!' 
        })
      } else {
        // Reactivate subscription
        await db.subscriber.update({
          where: { email: body.email },
          data: { active: true }
        })
        return NextResponse.json({ 
          success: true, 
          message: 'Sua inscrição foi reativada com sucesso!' 
        })
      }
    }

    const subscriber = await db.subscriber.create({
      data: {
        email: body.email,
        name: body.name || null,
        active: true,
      }
    })

    console.log('Subscriber created:', subscriber)

    return NextResponse.json({ 
      success: true, 
      subscriber,
      message: 'Inscrição realizada com sucesso! Você receberá nossas novidades em breve.'
    })
  } catch (error: any) {
    console.error('Erro ao inscrever:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: true,
        message: 'Este email já está inscrito na nossa newsletter!' 
      })
    }
    
    return NextResponse.json({ 
      error: 'Erro ao realizar inscrição. Tente novamente.',
      details: error.message 
    }, { status: 500 })
  }
}
