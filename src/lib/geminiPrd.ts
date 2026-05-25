import { GoogleGenAI } from '@google/genai'

export const GEMINI_MODEL = process.env.GEMINI_PRD_MODEL || 'gemini-2.5-flash-lite'
export const GEMINI_FALLBACK_MODEL = process.env.GEMINI_PRD_FALLBACK_MODEL || 'gemini-2.5-flash-lite'
export const GEMINI_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_PRD_MAX_OUTPUT_TOKENS || 14000)
export const GENERATION_TIMEOUT_MS = Number(process.env.PRD_GENERATION_TIMEOUT_MS || 120000)

export function isRetriableGeminiError(error: any) {
  const message = String(error?.message || '')
  return error?.status === 429 || error?.status === 503 || message.includes('"code":429') || message.includes('"code":503')
}

export function getPublicGenerationError(error: any) {
  const message = String(error?.message || '')
  if (error?.status === 429 || message.includes('"code":429') || message.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini đang giới hạn quota/tần suất. Vui lòng đợi một lát rồi bấm tạo lại.'
  }
  if (error?.status === 503 || message.includes('"code":503') || message.includes('UNAVAILABLE') || message.includes('high demand')) {
    return 'Gemini đang quá tải tạm thời. Hệ thống đã thử lại và fallback model nhưng chưa thành công, vui lòng bấm tạo lại sau ít phút.'
  }
  if (message.includes('timed out')) {
    return 'Tác vụ mất quá lâu và đã timeout. Vui lòng bấm tạo lại.'
  }
  return error?.message || 'Không thể tạo nội dung.'
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function withGenerationTimeout<T>(task: Promise<T>) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Generation timed out after ${Math.round(GENERATION_TIMEOUT_MS / 1000)} seconds.`)), GENERATION_TIMEOUT_MS)
  })

  try {
    return await Promise.race([task, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function generateGeminiText(client: GoogleGenAI, prompt: string, systemInstruction: string) {
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
            temperature: 0.35
          }
        })

        return { text: response.text || '', model }
      } catch (error: any) {
        lastError = error
        if (!isRetriableGeminiError(error)) throw error
        console.warn('gemini_generation_retry', { model, attempt, message: error?.message, status: error?.status })
        await sleep(attempt * 1500)
      }
    }
  }

  throw lastError
}
