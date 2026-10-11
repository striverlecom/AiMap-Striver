import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import { buildPrdSystemInstruction, loadPrdKnowledgePack } from '@/lib/prdKnowledge'
import {
  buildPrdPrompt,
  buildBlankCustomUseCases,
  extractPrdUseCases,
  getMissingPrdSections,
  mergePrdItems,
  normalizeCustomUseCases,
  safeJsonParse,
  type PrdItem
} from '@/lib/prd'
import { getGeminiApiKey } from '@/lib/geminiConfig'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PROVIDER = (process.env.PRD_PROVIDER || 'gemini').toLowerCase()
const OPENAI_MODEL = process.env.OPENAI_PRD_MODEL || 'gpt-4.1'
const GEMINI_MODEL = process.env.GEMINI_PRD_MODEL || 'gemini-3.5-flash'
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_PRD_FALLBACK_MODEL || 'gemini-3.5-flash-lite'
const OPENAI_TIMEOUT_MS = Number(process.env.OPENAI_PRD_TIMEOUT_MS || 180000)
const OPENAI_MAX_OUTPUT_TOKENS = Number(process.env.OPENAI_PRD_MAX_OUTPUT_TOKENS || 14000)
const GEMINI_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_PRD_MAX_OUTPUT_TOKENS || 24000)
const GENERATION_TIMEOUT_MS = Number(process.env.PRD_GENERATION_TIMEOUT_MS || 180000)

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

async function generateOpenAiMarkdown(client: OpenAI, vectorStoreId: string, prompt: string) {
  const response = await client.responses.create({
    model: OPENAI_MODEL,
    input: prompt,
    max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS,
    tools: [{
      type: 'file_search',
      vector_store_ids: [vectorStoreId]
    }] as any
  } as any)

  return {
    responseId: response.id,
    markdown: response.output_text || ''
  }
}

function isRetriableGeminiError(error: any) {
  const message = String(error?.message || '')
  return error?.status === 429 || error?.status === 503 || message.includes('"code":429') || message.includes('"code":503')
}

function getPublicGenerationError(error: any) {
  const message = String(error?.message || '')
  if (error?.status === 429 || message.includes('"code":429') || message.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini đang giới hạn quota/tần suất. Vui lòng đợi một lát rồi bấm tạo lại PRD này.'
  }

  if (error?.status === 503 || message.includes('"code":503') || message.includes('UNAVAILABLE') || message.includes('high demand')) {
    return 'Gemini đang quá tải tạm thời. Hệ thống đã thử lại và fallback model nhưng chưa thành công, vui lòng bấm tạo lại sau ít phút.'
  }

  if (message.includes('timed out')) {
    return 'Tạo PRD mất quá lâu và đã timeout. Vui lòng bấm tạo lại PRD này.'
  }

  return error?.message || 'Không thể tạo PRD.'
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateGeminiMarkdown(client: GoogleGenAI, prompt: string, systemInstruction: string) {
  const models = Array.from(new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL].filter(Boolean)))
  let lastError: any = null

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
            temperature: 0.4
          }
        })

        return {
          responseId: null,
          markdown: response.text || '',
          model
        }
      } catch (error: any) {
        lastError = error
        if (!isRetriableGeminiError(error)) throw error
        console.warn('day8_prd_gemini_retry', { model, attempt, message: error?.message, status: error?.status })
        await sleep(attempt * 1500)
      }
    }
  }

  throw lastError
}

async function withGenerationTimeout<T>(task: Promise<T>) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`PRD generation timed out after ${Math.round(GENERATION_TIMEOUT_MS / 1000)} seconds.`)), GENERATION_TIMEOUT_MS)
  })

  try {
    return await Promise.race([task, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const openAiApiKey = process.env.OPENAI_API_KEY
  const vectorStoreId = process.env.OPENAI_PRD_VECTOR_STORE_ID
  const geminiApiKey = getGeminiApiKey()

  if (!['gemini', 'openai'].includes(PROVIDER)) {
    return NextResponse.json({ error: 'Invalid PRD_PROVIDER. Use gemini or openai.' }, { status: 500 })
  }

  if (PROVIDER === 'gemini' && !geminiApiKey) {
    return NextResponse.json({
      error: 'Gemini PRD generation is not configured. Set GEMINI_API_KEY on the server.'
    }, { status: 500 })
  }

  if (PROVIDER === 'openai' && (!openAiApiKey || !vectorStoreId)) {
    return NextResponse.json({
      error: 'OpenAI PRD generation is not configured. Set OPENAI_API_KEY and OPENAI_PRD_VECTOR_STORE_ID on the server.'
    }, { status: 500 })
  }

  const body = await req.json().catch(() => ({}))
  const mode = body?.mode === 'custom' ? 'custom' : 'system'
  const systemUseCases = extractPrdUseCases(user)
  const customUseCases = normalizeCustomUseCases(body?.customUseCases)
  const useCases = mode === 'custom' ? customUseCases : systemUseCases

  if (mode === 'system' && (useCases.length < 1 || useCases.length > 3 || !user.day6Data || !user.day7Data)) {
    return NextResponse.json({
      error: 'Cần chọn ít nhất 1 use-case từ Ngày 5 và có dữ liệu Ngày 6/7 trước khi tạo PRD.'
    }, { status: 400 })
  }

  if (mode === 'custom' && (useCases.length < 1 || useCases.length > 3)) {
    return NextResponse.json({
      error: 'Vui lÃ²ng nháº­p tá»« 1 Ä‘áº¿n 3 use-case tÃ¹y chá»‰nh trÆ°á»›c khi táº¡o PRD.'
    }, { status: 400 })
  }

  const requestedIndex = Number(body?.useCaseIndex || 0)
  const manualWorkflows = body?.manualWorkflows && typeof body.manualWorkflows === 'object' ? body.manualWorkflows : {}
  const storedItems = safeJsonParse<PrdItem[]>(user.day8Data?.prdData, [])
  const seedItems = mode === 'custom' ? [] : storedItems
  const existing = mergePrdItems(seedItems, useCases).map(item => {
    const submitted = manualWorkflows[String(item.useCaseIndex)]
    return typeof submitted === 'string' ? { ...item, manualWorkflow: submitted.trim() } : item
  })
  const targets = requestedIndex ? existing.filter(item => item.useCaseIndex === requestedIndex) : existing

  if (requestedIndex && targets.length !== 1) {
    return NextResponse.json({ error: 'Invalid useCaseIndex' }, { status: 400 })
  }

  const missingManualWorkflow = targets.find(item => !item.manualWorkflow.trim())
  if (missingManualWorkflow) {
    return NextResponse.json({
      error: `Vui lòng mô tả luồng/các bước công việc thủ công thực tế cho use-case #${missingManualWorkflow.useCaseIndex} trước khi tạo PRD.`
    }, { status: 400 })
  }

  const startedAt = new Date().toISOString()
  let items = existing.map(item => targets.some(target => target.useCaseIndex === item.useCaseIndex)
    ? { ...item, status: 'generating' as const, errorMessage: null, generatedAt: startedAt }
    : item
  )

  await prisma.day8Data.upsert({
    where: { userId: user.id },
    update: { prdData: JSON.stringify(items) },
    create: { userId: user.id, prdData: JSON.stringify(items) }
  })

  const openAiClient = PROVIDER === 'openai' && openAiApiKey
    ? new OpenAI({ apiKey: openAiApiKey, timeout: OPENAI_TIMEOUT_MS, maxRetries: 1 })
    : null
  const geminiClient = PROVIDER === 'gemini' && geminiApiKey
    ? new GoogleGenAI({ apiKey: geminiApiKey })
    : null
  const systemInstruction = PROVIDER === 'gemini'
    ? buildPrdSystemInstruction(await loadPrdKnowledgePack())
    : ''

  for (const target of targets) {
    const prompt = buildPrdPrompt(target, user)
    let responseId: string | null = null
    let model = PROVIDER === 'gemini' ? GEMINI_MODEL : OPENAI_MODEL

    try {
      console.info('day8_prd_generate_start', {
        userId: user.id,
        useCaseIndex: target.useCaseIndex,
        provider: PROVIDER,
        model
      })

      let generated = PROVIDER === 'gemini'
        ? await withGenerationTimeout(generateGeminiMarkdown(geminiClient!, prompt, systemInstruction))
        : await withGenerationTimeout(generateOpenAiMarkdown(openAiClient!, vectorStoreId!, prompt))
      responseId = generated.responseId
      if ('model' in generated && generated.model) model = generated.model
      let markdown = generated.markdown.trim()
      let missing = getMissingPrdSections(markdown)

      if (missing.length > 0) {
        const repairPrompt = `${prompt}\n\nBản trước thiếu các phần sau: ${missing.join(', ')}. Hãy tạo lại PRD đầy đủ, không tóm tắt và không bỏ phần.`
        generated = PROVIDER === 'gemini'
          ? await withGenerationTimeout(generateGeminiMarkdown(geminiClient!, repairPrompt, systemInstruction))
          : await withGenerationTimeout(generateOpenAiMarkdown(openAiClient!, vectorStoreId!, repairPrompt))
        responseId = generated.responseId
        if ('model' in generated && generated.model) model = generated.model
        markdown = generated.markdown.trim()
        missing = getMissingPrdSections(markdown)
      }

      const updated: PrdItem = {
        ...target,
        status: missing.length > 0 ? 'failed' : 'completed',
        markdown,
        errorMessage: missing.length > 0 ? `PRD còn thiếu phần: ${missing.join(', ')}` : null,
        model,
        responseId,
        generatedAt: new Date().toISOString()
      }

      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? updated : item)
      console.info('day8_prd_generate_done', {
        userId: user.id,
        useCaseIndex: target.useCaseIndex,
        provider: PROVIDER,
        status: updated.status,
        markdownLength: markdown.length,
        missingCount: missing.length
      })
    } catch (error: any) {
      console.error('day8_prd_generate_error', {
        userId: user.id,
        useCaseIndex: target.useCaseIndex,
        provider: PROVIDER,
        message: error?.message,
        status: error?.status,
        code: error?.code
      })
      items = items.map(item => item.useCaseIndex === target.useCaseIndex ? {
        ...item,
        status: 'failed',
        errorMessage: getPublicGenerationError(error),
        model,
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

  const nextDay = items.length > 0 && items.every(item => item.status === 'completed' && item.markdown.trim().length > 0) ? 9 : 8
  if (user.currentDay < nextDay) {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentDay: nextDay }
    })
  }

  return NextResponse.json({ success: true, prdData: items })
}

export async function GET(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const mode = new URL(req.url).searchParams.get('mode') === 'custom' ? 'custom' : 'system'
  const systemUseCases = extractPrdUseCases(user)
  const storedItems = safeJsonParse<PrdItem[]>(user.day8Data?.prdData, [])
  const storedCustomItems = storedItems.filter(item => item.sourceType === 'custom')
  const items = mode === 'custom'
    ? storedCustomItems.length > 0
      ? storedCustomItems
      : mergePrdItems([], buildBlankCustomUseCases())
    : systemUseCases.length === 3
    ? mergePrdItems(storedItems, systemUseCases)
    : storedItems.length > 0
      ? storedItems
      : mergePrdItems([], buildBlankCustomUseCases())

  return NextResponse.json({ success: true, prdData: items })
}
