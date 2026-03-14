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

    const payload = await decrypt(sessionCookie.value)
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, password } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email) updateData.email = email
    
    // Hash new password if provided
    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isPaid: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return NextResponse.json({ error: 'Email này đã tồn tại trong hệ thống.' }, { status: 400 })
    }
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
