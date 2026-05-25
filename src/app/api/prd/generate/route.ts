import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import {
  buildPrdPrompt,
  extractPrdUseCases,
  getMissingPrdSections,
  mergePrdItems,
  safeJsonParse,
  type PrdItem
} from '@/lib/prd'

export const dynamic = 'force-dynamic'

const MODEL = process.env.OPENAI_PRD_MODEL || 'gpt-5'

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
    include: {
      day1Data: true,
      day2Data: true,
      day4Data: true,
      day5Data: true,
      day6Data: true,
      day7Data: true,
      day8Data: true
    }
  })
}

async function generateMarkdown(client: OpenAI, vectorStoreId: string, prompt: string) {
  const response = await client.responses.create({
    model: MODEL,
    input: prompt,
    tools: [{
      type: 'file_search',
      vector_store_ids: [vectorStoreId]
    }] as any
  })

  return {
    responseId: response.id,
    markdown: response.output_text || ''
  }
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const apiKey = process.env.OPENAI_API_KEY
  const vectorStoreId = process.env.OPENAI_PRD_VECTOR_STORE_ID

  if (!apiKey || !vectorStoreId) {
    return NextResponse.json({
      error: 'OpenAI PRD generation is not configured. Set OPENAI_API_KEY and OPENAI_PRD_VECTOR_STORE_ID on the server.'
    }, { status: 500 })
  }

  const useCases = extractPrdUseCases(user)
  if (useCases.length !== 3 || !user.day6Data || !user.day7Data) {
    return NextResponse.json({
      error: 'Cần có đủ 3 use-case từ Ngày 5 và dữ liệu Ngày 6/7 trước khi tạo PRD.'
    }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const requestedIndex = Number(body?.useCaseIndex || 0)
  const existing = mergePrdItems(safeJsonParse<PrdItem[]>(user.day8Data?.prdData, []), useCases)
  const targets = requestedIndex ? existing.filter(item => item.useCaseIndex === requestedIndex) : existing

  if (requestedIndex && targets.length !== 1) {
    return NextResponse.json({ error: 'Invalid useCaseIndex' }, { status: 400 })
  }

  let items = existing.map(item => targets.some(target => target.useCaseIndex === item.useCaseIndex)
    ? { ...item, status: 'generating' as const, errorMessage: null }
    : item
  )

  await prisma.day8Data.upsert({
    where: { userId: user.id },
    update: { prdData: JSON.stringify(items) },
    create: { userId: user.id, prdData: JSON.stringify(items) }
  })

  const client = new OpenAI({ apiKey })

  for (const target of targets) {
    const prompt = buildPrdPrompt(target, user)
    let responseId: string | null = null

    try {
      let generated = await generateMarkdown(client, vectorStoreId, prompt)
      responseId = generated.responseId
      let markdown = generated.markdown.trim()
      let missing = getMissingPrdSections(markdown)

      if (missing.length > 0) {
        generated = await generateMarkdown(
          client,
          vectorStoreId,
          `${prompt}\n\nBản trước thiếu các phần sau: ${missing.join(', ')}. Hãy tạo lại PRD đầy đủ, không tóm tắt và không bỏ phần.`
        )
        responseId = generated.responseId
        markdown = generated.markdown.trim()
        missing = getMissingPrdSections(markdown)
      }

      const updated: PrdItem = {
        ...target,
        status: missing.length > 0 ? 'failed' : 'completed',
        markdown,
        errorMessage: missing.length > 0 ? `PRD còn thiếu phần: ${missing.join(', ')}` : null,
        model: MODEL,
        responseId,
        generatedAt: new Date().toISOString()
      }

      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? updated : item)
    } catch (error: any) {
      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? {
        ...item,
        status: 'failed',
        errorMessage: error?.message || 'Không thể tạo PRD.',
        model: MODEL,
        responseId,
        generatedAt: new Date().toISOString()
      } : item)
    }

    await prisma.day8Data.upsert({
      where: { userId: user.id },
      update: { prdData: JSON.stringify(items) },
      create: { userId: user.id, prdData: JSON.stringify(items) }
    })
  }

  if (user.currentDay < 8) {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentDay: 8 }
    })
  }

  return NextResponse.json({ success: true, prdData: items })
}
