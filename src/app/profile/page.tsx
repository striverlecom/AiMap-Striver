import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ProfileClient from './client'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get('session')?.value
  
  if (!sessionValue) {
    redirect('/login')
  }

  const payload = await decrypt(sessionValue)
  if (!payload?.userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      email: true,
      name: true,
      isPaid: true
    }
  })

  if (!user) {
    redirect('/login')
  }

  return <ProfileClient serverUser={user} />
}
