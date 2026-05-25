import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let payload
    try {
      payload = await decrypt(token)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const isBasic = url.searchParams.get('basic') === 'true'

    if (isBasic) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            isPaid: true,
            paymentRef: true
          }
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        return NextResponse.json({ user }, { headers: noStoreHeaders })
      } catch (error) {
        console.error('Basic user lookup error:', error)

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            isPaid: true
          }
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        return NextResponse.json({ user: { ...user, paymentRef: null } }, { headers: noStoreHeaders })
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        day1Data: true,
        day2Data: true,
        day3Data: true,
        day4Data: true,
        day5Data: true,
        day6Data: true,
        day7Data: true,
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Hide password before returning
    const { password, ...safeUser } = user
    return NextResponse.json({ user: safeUser }, { headers: noStoreHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}
