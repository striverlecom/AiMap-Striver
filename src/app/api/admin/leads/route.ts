import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

const ADMIN_KEY = process.env.ADMIN_KEY || 'REDACTED_ADMIN_KEY'

async function isAuthorizedAdmin(req: Request) {
  // Check header or query key
  const url = new URL(req.url)
  const queryKey = url.searchParams.get('adminKey')
  const headerKey = req.headers.get('x-admin-key')
  if (queryKey === ADMIN_KEY || headerKey === ADMIN_KEY) {
    return true
  }

  // Check cookie session
  try {
    const token = req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
    if (token) {
      const payload = await decrypt(token)
      if (payload?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { email: true }
        })
        const adminEmails = (process.env.ADMIN_EMAILS || 'admin@striver.ai,striverle.com,lequangcuong,striveraivn@gmail.com').toLowerCase().split(',')
        if (user?.email && adminEmails.some(adm => user.email.toLowerCase().includes(adm.trim()))) {
          return true
        }
      }
    }
  } catch {}

  return false
}

export async function GET(req: Request) {
  const isAuth = await isAuthorizedAdmin(req)
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Vui lòng cung cấp Admin Key hợp lệ.' }, { status: 401 })
  }

  try {
    const leads = await (prisma as any).consultingRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isPaid: true,
            currentDay: true,
            day1Data: true,
            day2Data: true,
            day3Data: true,
            day4Data: true,
            day5Data: true,
            day6Data: true,
            day7Data: true,
            day8Data: true,
            day9Data: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, leads })
  } catch (error: any) {
    console.error('Error fetching admin leads:', error)
    return NextResponse.json({ error: 'Không thể tải danh sách leads lúc này.' }, { status: 500 })
  }
}
