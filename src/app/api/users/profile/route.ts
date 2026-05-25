import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload
    try {
      payload = await decrypt(sessionCookie.value)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { email, password } = body

    const updateData: {
      email?: string
      password?: string
    } = {}

    if (email) {
      updateData.email = email
    }

    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Không có thông tin cần cập nhật.' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        isPaid: true
      }
    })

    return NextResponse.json({ ...updatedUser, name: null })
  } catch (error: any) {
    const target = error.meta?.target
    const isEmailConflict = error.code === 'P2002' && (
      Array.isArray(target) ? target.includes('email') : String(target || '').includes('email')
    )

    if (isEmailConflict) {
      return NextResponse.json({ error: 'Email này đã tồn tại trong hệ thống.' }, { status: 400 })
    }

    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
