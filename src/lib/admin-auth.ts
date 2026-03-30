import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

// Chave secreta consistente em todos os arquivos
export const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'partido-liberal-jwt-secret-key-2024'
  return new TextEncoder().encode(secret)
}

// Verificar se o usuário está autenticado
export async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    if (!token) return false
    await jwtVerify(token, getSecretKey())
    return true
  } catch {
    return false
  }
}

// Obter dados do usuário do token
export async function getAuthUser(): Promise<{ email: string; name: string; role: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as { email: string; name: string; role: string }
  } catch {
    return null
  }
}

// Criar token JWT
export async function createToken(payload: { email: string; name: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey())
}
