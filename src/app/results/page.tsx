import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ResultsClient from './client'

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return redirect('/login')
  
  const payload = await decrypt(token)
  if (!payload?.userId) return redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: {
      day1Data: true, day2Data: true, day4Data: true, 
      day5Data: true, day6Data: true, day7Data: true
    }
  })

  if (!user || !user.isPaid) return redirect('/payment')

  return <ResultsClient serverUser={user} />
}
