import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const isBasic = url.searchParams.get('basic') === 'true'

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      ...(isBasic ? {} : {
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
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Hide password before returning
    const { password, ...safeUser } = user
    return NextResponse.json({ user: safeUser }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
