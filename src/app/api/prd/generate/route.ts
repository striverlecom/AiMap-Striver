import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import { buildPrdSystemInstruction, loadPrdKnowledgePack } from '@/lib/prdKnowledge'
import {
  buildPrdPrompt,
  extractPrdUseCases,
  getMissingPrdSections,
  mergePrdItems,
  safeJsonParse,
  type PrdItem
} from '@/lib/prd'

export const dynamic = 'force-dynamic'

const PROVIDER = (process.env.PRD_PROVIDER || 'gemini').toLowerCase()
const OPENAI_MODEL = process.env.OPENAI_PRD_MODEL || 'gpt-4.1'
const GEMINI_MODEL = process.env.GEMINI_PRD_MODEL || 'gemini-2.5-flash'
const OPENAI_TIMEOUT_MS = Number(process.env.OPENAI_PRD_TIMEOUT_MS || 180000)
const OPENAI_MAX_OUTPUT_TOKENS = Number(process.env.OPENAI_PRD_MAX_OUTPUT_TOKENS || 14000)
const GEMINI_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_PRD_MAX_OUTPUT_TOKENS || 14000)

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

async function generateGeminiMarkdown(client: GoogleGenAI, prompt: string, systemInstruction: string) {
  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      temperature: 0.4
    }
  })

  return {
    responseId: null,
    markdown: response.text || ''
  }
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const openAiApiKey = process.env.OPENAI_API_KEY
  const vectorStoreId = process.env.OPENAI_PRD_VECTOR_STORE_ID
  const geminiApiKey = process.env.GEMINI_API_KEY

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

  const useCases = extractPrdUseCases(user)
  if (useCases.length !== 3 || !user.day6Data || !user.day7Data) {
    return NextResponse.json({
      error: 'Cần có đủ 3 use-case từ Ngày 5 và dữ liệu Ngày 6/7 trước khi tạo PRD.'
    }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const requestedIndex = Number(body?.useCaseIndex || 0)
  const manualWorkflows = body?.manualWorkflows && typeof body.manualWorkflows === 'object' ? body.manualWorkflows : {}
  const existing = mergePrdItems(safeJsonParse<PrdItem[]>(user.day8Data?.prdData, []), useCases).map(item => {
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

  let items = existing.map(item => targets.some(target => target.useCaseIndex === item.useCaseIndex)
    ? { ...item, status: 'generating' as const, errorMessage: null }
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
    const model = PROVIDER === 'gemini' ? GEMINI_MODEL : OPENAI_MODEL

    try {
      console.info('day8_prd_generate_start', {
        userId: user.id,
        useCaseIndex: target.useCaseIndex,
        provider: PROVIDER,
        model
      })

      let generated = PROVIDER === 'gemini'
        ? await generateGeminiMarkdown(geminiClient!, prompt, systemInstruction)
        : await generateOpenAiMarkdown(openAiClient!, vectorStoreId!, prompt)
      responseId = generated.responseId
      let markdown = generated.markdown.trim()
      let missing = getMissingPrdSections(markdown)

      if (missing.length > 0) {
        const repairPrompt = `${prompt}\n\nBản trước thiếu các phần sau: ${missing.join(', ')}. Hãy tạo lại PRD đầy đủ, không tóm tắt và không bỏ phần.`
        generated = PROVIDER === 'gemini'
          ? await generateGeminiMarkdown(geminiClient!, repairPrompt, systemInstruction)
          : await generateOpenAiMarkdown(openAiClient!, vectorStoreId!, repairPrompt)
        responseId = generated.responseId
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
        errorMessage: error?.message || 'Không thể tạo PRD.',
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

  if (user.currentDay < 8) {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentDay: 8 }
    })
  }

  return NextResponse.json({ success: true, prdData: items })
}
