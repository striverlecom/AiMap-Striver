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

  let payload
  try {
    payload = await decrypt(sessionValue)
  } catch (error) {
    console.error('Profile session decrypt error:', error)
    redirect('/login')
  }

  if (!payload?.userId) {
    redirect('/login')
  }

  const fallbackUser = {
    email: typeof payload.email === 'string' ? payload.email : '',
    name: '',
    isPaid: Boolean(payload.isPaid)
  }

  let user
  try {
    user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        email: true,
        isPaid: true
      }
    })

  } catch (error) {
    console.error('Profile user lookup error:', error)
    return (
      <ProfileClient
        serverUser={fallbackUser}
        serverWarning="Không thể tải đầy đủ dữ liệu hồ sơ từ database. Bạn vẫn có thể xem trạng thái đăng nhập hiện tại."
      />
    )
  }

  if (!user) {
    redirect('/login')
  }

  return <ProfileClient serverUser={{ ...user, name: '' }} />
}
