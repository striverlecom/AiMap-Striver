import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    // data from sepay usually has:
    // {
    //    "id": 12345,
    //    "gateway": "Vietcombank",
    //    "transactionDate": "2023-10-10 10:10:10",
    //    "accountNumber": "0123456789",
    //    "code": "XYZ",
    //    "content": "AI123456 thanh toan ban do AI",
    //    "transferType": "in",
    //    "transferAmount": 500000,
    //    ...
    // }
    
    // Safety check - You should implement Sepay Webhook Token verification here in production
    
    if (data.transferType === 'in' && data.transferAmount >= 500000) {
      const content = (data.content || '').toUpperCase()
      
      // Find user where paymentRef is included in the content
      // Since SQLite doesn't natively support contains easily in Prisma without full scan, 
      // we ideally fetch users that are not paid and check memory, but this is a POC.
      const users = await prisma.user.findMany({
        where: { isPaid: false, paymentRef: { not: null } }
      })
      
      for (const user of users) {
        if (user.paymentRef && content.includes(user.paymentRef.toUpperCase())) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isPaid: true }
          })
          console.log(`User ${user.email} marked as PAID.`)
          return NextResponse.json({ success: true, message: 'Payment applied.' })
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook received but no matching user found.' })
  } catch (error: any) {
    console.error('Sepay Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
