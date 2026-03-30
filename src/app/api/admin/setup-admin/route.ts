import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Função para criar hash SHA-256 da senha
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, setupKey } = await request.json()

    // Chave de setup para evitar criação não autorizada
    const validSetupKey = process.env.ADMIN_SETUP_KEY || 'pl-setup-2024-secure'
    
    if (setupKey !== validSetupKey) {
      return NextResponse.json(
        { success: false, message: 'Chave de setup inválida' },
        { status: 403 }
      )
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe algum admin
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/AdminUser?select=count`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'count=exact',
        },
      }
    )

    // Se a tabela não existe, retornar instruções
    if (!checkRes.ok) {
      const createTableSQL = `
-- Execute este SQL no Supabase SQL Editor para criar a tabela:

CREATE TABLE IF NOT EXISTS "AdminUser" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas service role
CREATE POLICY "Service role only" ON "AdminUser"
  FOR ALL USING (auth.role() = 'service_role');
`
      return NextResponse.json({
        success: false,
        message: 'Tabela AdminUser não existe. Crie a tabela no Supabase.',
        sql: createTableSQL
      })
    }

    // Verificar count
    const countHeader = checkRes.headers.get('content-range')
    const existingCount = countHeader ? parseInt(countHeader.split('/')[1]) : 0

    if (existingCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Já existe um administrador cadastrado' },
        { status: 400 }
      )
    }

    // Criar hash da senha
    const passwordHash = await hashPassword(password)

    // Inserir admin
    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/AdminUser?select=*`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password_hash: passwordHash,
          name: name.trim(),
          active: true,
        }),
      }
    )

    if (!insertRes.ok) {
      const error = await insertRes.text()
      console.error('Erro ao criar admin:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao criar administrador' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Administrador criado com sucesso! Use as credenciais para fazer login.'
    })
  } catch (error) {
    console.error('Erro no setup:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao processar setup' },
      { status: 500 }
    )
  }
}

// GET - Verificar status do setup
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/AdminUser?select=count`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'count=exact',
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ 
        setupRequired: true, 
        tableExists: false,
        message: 'Tabela AdminUser não existe' 
      })
    }

    const countHeader = res.headers.get('content-range')
    const count = countHeader ? parseInt(countHeader.split('/')[1]) : 0

    return NextResponse.json({
      setupRequired: count === 0,
      tableExists: true,
      adminCount: count
    })
  } catch (error) {
    return NextResponse.json({ 
      setupRequired: true, 
      tableExists: false,
      message: 'Erro ao verificar status' 
    })
  }
}
