import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, company, topic, notes, source } = body || {}

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Vui lòng cung cấp họ và tên.' }, { status: 400 })
    }

    if (!phone || typeof phone !== 'string' || phone.trim().replace(/\D/g, '').length < 8) {
      return NextResponse.json({ error: 'Vui lòng cung cấp số điện thoại hoặc Zalo hợp lệ.' }, { status: 400 })
    }

    // Attempt to extract userId from session cookie if available
    let userId: string | undefined = undefined
    try {
      const token = req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
      if (token) {
        const payload = await decrypt(token)
        if (payload?.userId) {
          userId = payload.userId as string
        }
      }
    } catch {}

    const consultingRequest = await (prisma as any).consultingRequest.create({
      data: {
        userId,
        name: name.trim(),
        phone: phone.trim(),
        company: company ? String(company).trim() : null,
        topic: topic ? String(topic).trim() : 'Thẩm định 1-on-1',
        notes: notes ? String(notes).trim() : null,
        source: source ? String(source).trim() : 'general',
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Đã tiếp nhận yêu cầu thẩm định thành công. Đội ngũ Striver AI sẽ liên hệ lại trong thời gian sớm nhất!',
      requestId: consultingRequest.id
    })
  } catch (error: any) {
    console.error('Error submitting consulting request:', error)
    return NextResponse.json({ error: 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc liên hệ trực tiếp.' }, { status: 500 })
  }
}
