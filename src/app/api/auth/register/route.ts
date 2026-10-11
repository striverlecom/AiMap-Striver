import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!normalizedEmail || !emailRegex.test(normalizedEmail) || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email không hợp lệ hoặc thiếu thông tin.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Mật khẩu phải có độ dài tối thiểu 8 ký tự.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return NextResponse.json({ error: 'Tài khoản email này đã tồn tại.' }, { status: 409 })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        paymentRef: 'AI' + Math.floor(100000 + Math.random() * 900000)
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err: any) {
    console.error('Registration error:', err)
    const isProduction = process.env.NODE_ENV === 'production'
    const message = isProduction
      ? 'Hệ thống đang gặp sự cố kết nối máy chủ. Vui lòng thử lại sau ít phút.'
      : (err?.message || 'Internal server error')
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
