import Day9Client from './client'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { extractCompletedPrds } from '@/lib/systemInstruction'
import { mergeSiItems, safeJsonParse, type SiItem } from '@/lib/systemInstruction'

import { isGeminiConfigured } from '@/lib/geminiConfig'

export const dynamic = 'force-dynamic'

export default async function Day9Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) redirect('/login')

  let payload
  try {
    payload = await decrypt(token)
  } catch {
    redirect('/login')
  }

  if (!payload?.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { day8Data: true, day9Data: true }
  })

  if (!user || !user.isPaid) redirect('/payment')

  const prds = extractCompletedPrds(user.day8Data)
  const siItems = mergeSiItems(safeJsonParse<SiItem[]>(user.day9Data?.siData, []), prds)

  return (
    <Day9Client
      prdCount={prds.length}
      prds={prds}
      initialItems={siItems}
      isConfigured={isGeminiConfigured()}
    />
  )
}
