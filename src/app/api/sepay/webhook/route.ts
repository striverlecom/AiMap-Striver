import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type SepayWebhookPayload = {
  transferType?: string
  transferAmount?: number
  content?: string
}

function isAuthorized(req: Request) {
  const secret = process.env.SEPAY_WEBHOOK_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'

  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const tokenHeader = req.headers.get('x-sepay-token')
  const apiKeyHeader = req.headers.get('x-api-key')

  return bearer === secret || tokenHeader === secret || apiKeyHeader === secret
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json() as SepayWebhookPayload
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
    
    const transferAmount = Number(data.transferAmount || 0)

    if (data.transferType === 'in' && transferAmount >= 500000) {
      const content = (data.content || '').toUpperCase()
      
      // Extract paymentRef pattern (e.g. AI123456) directly from transaction content
      const match = content.match(/AI\d{6}/i)
      let targetUser = null

      if (match) {
        targetUser = await prisma.user.findFirst({
          where: {
            paymentRef: match[0].toUpperCase(),
            isPaid: false
          }
        })
      }

      if (!targetUser) {
        // Fallback in case of custom formats
        const users = await prisma.user.findMany({
          where: { isPaid: false, paymentRef: { not: null } }
        })
        targetUser = users.find(u => u.paymentRef && content.includes(u.paymentRef.toUpperCase())) || null
      }

      if (targetUser) {
        await prisma.user.update({
          where: { id: targetUser.id },
          data: { isPaid: true }
        })
        console.log(`User ${targetUser.email} marked as PAID.`)
        return NextResponse.json({ success: true, message: 'Payment applied.' })
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook received but no matching user found.' })
  } catch (error: unknown) {
    console.error('Sepay Webhook Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown webhook error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
