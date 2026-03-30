import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/admin-auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// POST - Upload de imagem
export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado' }, { status: 400 })
    }

    // Validar tipo de ficheiro
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de ficheiro não permitido' }, { status: 400 })
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ficheiro muito grande (máximo 5MB)' }, { status: 400 })
    }

    // Gerar nome único
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const fileName = `uploads/${timestamp}-${randomStr}.${extension}`

    // Converter para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Fazer upload para Supabase Storage
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${fileName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const error = await uploadRes.text()
      console.error('Erro ao fazer upload:', error)
      // Fallback: retornar URL base64 para desenvolvimento
      const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`
      return NextResponse.json({ success: true, url: base64 })
    }

    // Retornar URL pública
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${fileName}`
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
