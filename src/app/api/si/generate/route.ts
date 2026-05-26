import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import { buildPrdSystemInstruction, loadPrdKnowledgePack } from '@/lib/prdKnowledge'
import {
  buildSiPrompt,
  extractCompletedPrds,
  getMissingSiSections,
  mergeSiItems,
  safeJsonParse,
  type SiItem
} from '@/lib/systemInstruction'
import { generateGeminiText, getPublicGenerationError, withGenerationTimeout } from '@/lib/geminiPrd'

export const dynamic = 'force-dynamic'

function getSessionToken(req: Request) {
  return req.headers.get('cookie')?.split('session=')[1]?.split(';')[0]
}

async function getUserFromSession(req: Request) {
  const token = getSessionToken(req)
  if (!token) return null

  let payload
  try {
    payload = await decrypt(token)
  } catch {
    return null
  }

  if (!payload?.userId) return null

  return prisma.user.findUnique({
    where: { id: payload.userId },
    include: { day8Data: true, day9Data: true }
  })
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini SI generation is not configured. Set GEMINI_API_KEY on the server.' }, { status: 500 })
  }

  const prds = extractCompletedPrds(user.day8Data)
  if (prds.length < 1) {
    return NextResponse.json({ error: 'Cần có ít nhất 1 PRD completed từ Ngày 8 trước khi tạo System Instruction ở Ngày 9.' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const requestedIndex = Number(body?.useCaseIndex || 0)
  const existing = mergeSiItems(safeJsonParse<SiItem[]>(user.day9Data?.siData, []), prds)
  const targets = requestedIndex ? prds.filter(item => item.useCaseIndex === requestedIndex) : prds

  if (requestedIndex && targets.length !== 1) {
    return NextResponse.json({ error: 'Invalid useCaseIndex' }, { status: 400 })
  }

  const startedAt = new Date().toISOString()
  let items = existing.map(item => targets.some(target => target.useCaseIndex === item.useCaseIndex)
    ? { ...item, status: 'generating' as const, errorMessage: null, generatedAt: startedAt }
    : item
  )

  await prisma.day9Data.upsert({
    where: { userId: user.id },
    update: { siData: JSON.stringify(items) },
    create: { userId: user.id, siData: JSON.stringify(items) }
  })

  const client = new GoogleGenAI({ apiKey })
  const systemInstruction = buildPrdSystemInstruction(await loadPrdKnowledgePack())

  for (const target of targets) {
    let model = process.env.GEMINI_PRD_MODEL || 'gemini-2.5-flash-lite'

    try {
      console.info('day9_si_generate_start', { userId: user.id, useCaseIndex: target.useCaseIndex, provider: 'gemini', model })
      let generated = await withGenerationTimeout(generateGeminiText(client, buildSiPrompt(target), systemInstruction))
      model = generated.model
      let markdown = generated.text.trim()
      let missing = getMissingSiSections(markdown)

      if (missing.length > 0) {
        const repairPrompt = `${buildSiPrompt(target)}\n\nBản trước thiếu các phần sau: ${missing.join(', ')}. Hãy tạo lại đầy đủ, mỗi Agent phải có code fence xml và đủ 5 tags RCICE.`
        generated = await withGenerationTimeout(generateGeminiText(client, repairPrompt, systemInstruction))
        model = generated.model
        markdown = generated.text.trim()
        missing = getMissingSiSections(markdown)
      }

      const updated: SiItem = {
        useCaseIndex: target.useCaseIndex,
        useCaseTitle: target.useCaseTitle,
        status: missing.length > 0 ? 'failed' : 'completed',
        markdown,
        errorMessage: missing.length > 0 ? `System Instruction còn thiếu phần: ${missing.join(', ')}` : null,
        model,
        generatedAt: new Date().toISOString()
      }

      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? updated : item)
      console.info('day9_si_generate_done', { userId: user.id, useCaseIndex: target.useCaseIndex, status: updated.status, markdownLength: markdown.length, missingCount: missing.length })
    } catch (error: any) {
      console.error('day9_si_generate_error', { userId: user.id, useCaseIndex: target.useCaseIndex, message: error?.message, status: error?.status, code: error?.code })
      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? {
        ...item,
        status: 'failed',
        errorMessage: getPublicGenerationError(error),
        model,
        generatedAt: new Date().toISOString()
      } : item)
    }

    await prisma.day9Data.upsert({
      where: { userId: user.id },
      update: { siData: JSON.stringify(items) },
      create: { userId: user.id, siData: JSON.stringify(items) }
    })
  }

  if (user.currentDay < 9) {
    await prisma.user.update({ where: { id: user.id }, data: { currentDay: 9 } })
  }

  return NextResponse.json({ success: true, siData: items })
}

export async function GET(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const prds = extractCompletedPrds(user.day8Data)
  const items = mergeSiItems(safeJsonParse<SiItem[]>(user.day9Data?.siData, []), prds)
  return NextResponse.json({ success: true, siData: items })
}
