import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAuthorizedAdmin } from '@/lib/adminAuth'

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
