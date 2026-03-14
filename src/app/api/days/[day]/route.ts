import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: Promise<{ day: string }> }) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await decrypt(token)
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Need to await params.day in next 15+ 
    const dayValue = await params;
    const dayNum = parseInt(dayValue.day, 10)
    const data = await req.json()
    const { userId } = payload

    let result;

    switch(dayNum) {
      case 1:
        result = await prisma.day1Data.upsert({ where: { userId }, update: { ...data }, create: { userId, ...data } })
        break;
      case 2:
        result = await prisma.day2Data.upsert({ 
          where: { userId }, 
          update: { 
            revenue: data.revenue, targetRevenue: data.targetRevenue, 
            salaryCost: data.salaryCost, customerCount: data.customerCount, 
            churnRate: data.churnRate, avgOrderTime: data.avgOrderTime, 
            salaryData: data.salaryData, challenges: data.challenges, parameters: data.parameters
          }, 
          create: { 
            userId, revenue: data.revenue, targetRevenue: data.targetRevenue, 
            salaryCost: data.salaryCost, customerCount: data.customerCount, 
            churnRate: data.churnRate, avgOrderTime: data.avgOrderTime, 
            salaryData: data.salaryData, challenges: data.challenges, parameters: data.parameters
          } 
        })
        break;
      case 3:
        result = await prisma.day3Data.upsert({ 
          where: { userId }, 
          update: { interviewData: data.interviewData }, 
          create: { userId, interviewData: data.interviewData } 
        })
        break;
      case 4:
        result = await prisma.day4Data.upsert({ where: { userId }, update: { ...data }, create: { userId, ...data } })
        break;
      case 5:
        result = await prisma.day5Data.upsert({ where: { userId }, update: { ...data }, create: { userId, ...data } })
        break;
      case 6:
        result = await prisma.day6Data.upsert({ where: { userId }, update: { ...data }, create: { userId, ...data } })
        break;
      case 7:
        result = await prisma.day7Data.upsert({ where: { userId }, update: { ...data }, create: { userId, ...data } })
        break;
      default:
        return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user && user.currentDay <= dayNum && dayNum < 7) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentDay: dayNum + 1 }
      })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
