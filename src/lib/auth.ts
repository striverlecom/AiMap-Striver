import { jwtVerify, SignJWT } from 'jose'

function getSecretKey() {
  return process.env.JWT_SECRET || 'temporary-live-test-secret-change-in-vercel'
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
