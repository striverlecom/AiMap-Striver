import { jwtVerify, SignJWT } from 'jose'

function getSecretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is required and must be at least 32 characters')
  }
  return secret
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

