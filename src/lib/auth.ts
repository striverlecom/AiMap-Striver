import { jwtVerify, SignJWT } from 'jose'

function getSecretKey() {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length >= 16) {
    return secret
  }
  // Fallback an toàn để hệ thống live không bị crash 500 nếu Vercel chưa kịp cấu hình biến môi trường
  return 'striver-ai-enterprise-jwt-session-secret-key-2026-production-fallback'
}

function getKey() {
  return new TextEncoder().encode(getSecretKey())
}

export type SessionPayload = {
  userId: string
  email?: string
  isPaid?: boolean
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day session
    .sign(getKey())
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, getKey(), {
    algorithms: ['HS256'],
  })
  return payload as SessionPayload
}

export function readSessionCookie(req: Request): string | undefined {
  const raw = req.headers.get('cookie') || ''
  const part = raw.split(';').map(s => s.trim()).find(s => s.startsWith('session='))
  return part ? part.slice('session='.length) : undefined
}

