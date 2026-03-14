import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: 'No user found' })

    const data = { mapData: JSON.stringify({ test: 1 }) }
    
    // Simulate day 4 save
    const res = await prisma.day4Data.upsert({ 
      where: { userId: user.id }, 
      update: { ...data }, 
      create: { userId: user.id, ...data } 
    })

    return NextResponse.json({ success: true, res })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack })
  }
}
