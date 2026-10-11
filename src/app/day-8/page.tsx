import Day8Client from './client'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { buildBlankCustomUseCases, extractPrdUseCases, mergePrdItems, safeJsonParse, type PrdItem } from '@/lib/prd'
import { isGeminiConfigured } from '@/lib/geminiConfig'

export const dynamic = 'force-dynamic'

export default async function Day8Page() {
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
    include: {
      day5Data: true,
      day6Data: true,
      day7Data: true,
      day8Data: true
    }
  })

  if (!user || !user.isPaid) redirect('/payment')

  const useCases = extractPrdUseCases(user)
  const storedItems = safeJsonParse<PrdItem[]>(user.day8Data?.prdData, [])
  const storedCustomItems = storedItems.filter(item => item.sourceType === 'custom')
  const prdItems = useCases.length >= 1
    ? mergePrdItems(storedItems, useCases)
    : storedItems.length > 0
      ? storedItems
      : mergePrdItems([], buildBlankCustomUseCases())
  const customPrdItems = storedCustomItems.length > 0
    ? mergePrdItems(storedCustomItems, storedCustomItems)
    : mergePrdItems([], buildBlankCustomUseCases())

  return (
    <Day8Client
      useCases={useCases}
      initialPrds={prdItems}
      initialCustomPrds={customPrdItems}
      initialMode={storedCustomItems.length > 0 ? 'custom' : 'system'}
      isConfigured={process.env.PRD_PROVIDER === 'openai'
        ? Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_PRD_VECTOR_STORE_ID)
        : isGeminiConfigured()}
    />
  )
}
