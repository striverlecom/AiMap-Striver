import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAuthorizedAdmin } from '@/lib/adminAuth'

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
