import Day6Client from './client'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Day6Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) redirect('/login')

  const payload = await decrypt(token)
  if (!payload?.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { day2Data: true, day5Data: true, day6Data: true }
  })

  if (!user || !user.isPaid) redirect('/payment')

  return <Day6Client serverUser={user} />
}
