import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'

const ADMIN_KEY = process.env.ADMIN_KEY || 'REDACTED_ADMIN_KEY'

async function isAuthorizedAdmin(req: Request) {
  const url = new URL(req.url)
  const queryKey = url.searchParams.get('adminKey')
  const headerKey = req.headers.get('x-admin-key')
  if (queryKey === ADMIN_KEY || headerKey === ADMIN_KEY) return true

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuth = await isAuthorizedAdmin(req)
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { status, notes } = body || {}

    const updateData: Record<string, any> = {}
    if (status && typeof status === 'string') updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const updated = await (prisma as any).consultingRequest.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, lead: updated })
  } catch (error: any) {
    console.error('Error updating lead status:', error)
    return NextResponse.json({ error: 'Không thể cập nhật trạng thái lead.' }, { status: 500 })
  }
}
