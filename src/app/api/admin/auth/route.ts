import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Chave secreta do ambiente (não exposta no código)
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'partido-liberal-jwt-secret-key-2024'
  return new TextEncoder().encode(secret)
}

// Função simples para verificar senha com hash
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Usando uma verificação simples com bcrypt embutido
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex === hash
}

// Função para buscar admin no Supabase
async function findAdmin(email: string) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/AdminUser?email=eq.${encodeURIComponent(email)}&active=eq.true&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) return null
    
    const admins = await res.json()
    return admins[0] || null
  } catch (error) {
    console.error('Erro ao buscar admin:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar admin no Supabase
    const admin = await findAdmin(email)
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValid = await verifyPassword(password, admin.password_hash)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Criar token JWT
    const token = await new SignJWT({ 
      email: admin.email, 
      role: 'admin',
      name: admin.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(getSecretKey())

    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Login realizado com sucesso',
      user: { email: admin.email, name: admin.name }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
  return NextResponse.json({ success: true, message: 'Sessão terminada' })
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const { payload } = await jwtVerify(token, getSecretKey())
    return NextResponse.json({ authenticated: true, user: payload })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
