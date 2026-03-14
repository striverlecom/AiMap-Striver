import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return redirect('/login')

  const payload = await decrypt(token)
  if (!payload?.userId) return redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    select: { id: true, isPaid: true, currentDay: true }
  })

  // Prevent invalid or unpaid users
  if (!user || (!user.isPaid && user.id)) return redirect('/payment')

  return <DashboardClient serverUser={user} />
}
