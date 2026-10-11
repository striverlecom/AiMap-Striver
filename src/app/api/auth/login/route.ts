import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!normalizedEmail || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const pwdMatch = await bcrypt.compare(password, user.password)
    if (!pwdMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    // Create session
    const sessionData = { userId: user.id, email: user.email, isPaid: user.isPaid }
    const sessionToken = await encrypt(sessionData)

    const response = NextResponse.json({ success: true, user: { email: user.email, isPaid: user.isPaid } })
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return response
  } catch (err: any) {
    console.error('Login error:', err)
    const isProduction = process.env.NODE_ENV === 'production'
    const message = isProduction
      ? 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
      : (err?.message || 'Internal server error')
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
