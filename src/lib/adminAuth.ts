import { timingSafeEqual } from 'crypto'
import prisma from '@/lib/prisma'
import { decrypt, readSessionCookie } from '@/lib/auth'

export { readSessionCookie }

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export async function isAuthorizedAdmin(req: Request): Promise<boolean> {
  // 1) Khóa admin: CHỈ qua header x-admin-key, CHỈ khi đã cấu hình và đủ dài (>= 8 ký tự, khuyến nghị >= 24)
  const configured = process.env.ADMIN_KEY || ''
  const provided = req.headers.get('x-admin-key') || ''
  if (configured.length >= 8 && provided && safeEqual(provided, configured)) {
    return true
  }

  // 2) Email admin: so khớp CHÍNH XÁC với danh sách trong ADMIN_EMAILS (ngăn cách bằng dấu phẩy)
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (allowed.length === 0) return false

  try {
    const token = readSessionCookie(req)
    if (!token) return false
    const payload = await decrypt(token)
    if (!payload?.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { email: true }
    })

    return Boolean(user?.email && allowed.includes(user.email.toLowerCase()))
  } catch {
    return false
  }
}
