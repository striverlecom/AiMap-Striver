import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import { safeJsonParse } from '@/lib/prd'
import { generateGeminiText, getPublicGenerationError, withGenerationTimeout } from '@/lib/geminiPrd'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

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
      day3Data: true,
      day4Data: true,
      day5Data: true
    }
  })
}

function extractJsonArray(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) throw new Error('Gemini không trả về JSON array hợp lệ.')
  return JSON.parse(cleaned.slice(start, end + 1))
}

function normalizeSolutionName(value: unknown, index: number) {
  return String(value || `Giải pháp AI ${index + 1}`)
    .replace(/^agent\s+/i, 'AI ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 56)
}

function normalizeProblemSummary(value: unknown, index: number) {
  return String(value || `Vấn đề ${index + 1}`)
    .replace(/\s+/g, ' ')
    .replace(/\b(Ngày|Day)\s*\d+\s*[:\-–—]?\s*/gi, '')
    .trim()
    .slice(0, 90)
}

function buildDay5Prompt(user: any) {
  const context = {
    day1: {
      q1: user.day1Data?.q1 ?? null,
      q2: user.day1Data?.q2 ?? null,
      q3: user.day1Data?.q3 ?? null,
      q4: user.day1Data?.q4 ?? null,
      q5: user.day1Data?.q5 ?? null,
      q6: user.day1Data?.q6 ?? null,
      q7: user.day1Data?.q7 ?? null,
      totalScore: user.day1Data?.totalScore ?? null,
      evidenceData: safeJsonParse(user.day1Data?.evidenceData, {}),
      top3Problems: safeJsonParse(user.day1Data?.top3Problems, []),
      notes: user.day1Data?.notes || ''
    },
    day2: {
      revenue: user.day2Data?.revenue ?? null,
      targetRevenue: user.day2Data?.targetRevenue ?? null,
      salaryCost: user.day2Data?.salaryCost ?? null,
      customerCount: user.day2Data?.customerCount ?? null,
      churnRate: user.day2Data?.churnRate ?? null,
      avgOrderTime: user.day2Data?.avgOrderTime ?? null,
      salaryData: safeJsonParse(user.day2Data?.salaryData, []),
      challenges: safeJsonParse(user.day2Data?.challenges, {}),
      parameters: safeJsonParse(user.day2Data?.parameters, {})
    },
    day3: {
      interviewData: safeJsonParse(user.day3Data?.interviewData, {})
    },
    day4: {
      mapData: safeJsonParse(user.day4Data?.mapData, {})
    }
  }

  return `
Bạn là chuyên gia tư vấn AI transformation cho doanh nghiệp nhỏ và vừa.

Nhiệm vụ: dùng toàn bộ dữ liệu thực tế Ngày 1, Ngày 2, Ngày 3, Ngày 4 bên dưới để đề xuất danh sách giải pháp AI cho Ngày 5 thật sát thực tế. Không dùng dữ liệu mẫu. Không bịa thông tin ngoài dữ liệu người dùng đã cung cấp.

Nguyên tắc bắt buộc:
- Mỗi giải pháp phải gắn với một vấn đề thật từ Ngày 1-4.
- Field problem phải là bản tóm tắt ngắn gọn của vấn đề, 5-12 từ, tối đa 80 ký tự. Không liệt kê dài "Ngày 1..., Ngày 2..., Ngày 3..." trong problem. Nếu cần dẫn chứng dữ liệu từ ngày nào, đưa vào notes.
- Ưu tiên vấn đề có lãng phí giờ, ảnh hưởng doanh thu, nghẽn quy trình, lặp thao tác thủ công, hoặc xuất hiện trong phỏng vấn.
- Không đề xuất tên chung chung như "dùng ChatGPT"; hãy viết thành use-case triển khai rõ, ví dụ "Agent Phân Loại Lead Và Gợi Ý Kịch Bản Tư Vấn".
- Tên solution phải ngắn gọn, dễ đọc trên dashboard: 2-5 từ tiếng Việt, tối đa 45 ký tự. Ví dụ đúng: "AI Chấm Lead", "AI Nhắc Khách", "AI Tóm Tắt Đơn", "AI Soạn Báo Giá". Ví dụ sai: tên dài hơn một câu hoặc mô tả cả quy trình trong tên.
- Nếu cần mô tả chi tiết, đưa vào notes, không nhồi vào solution.
- Chấm impact và effort từ 1-5. Impact cao khi liên quan doanh thu, thời gian lãng phí, trải nghiệm khách hàng, hoặc năng suất nhiều nhân sự. Effort thấp nếu có thể MVP bằng form/chatbot/sheet/automation đơn giản.
- Tự chọn đúng 3 giải pháp có ROI/khả năng triển khai tốt nhất bằng isTop3=true.
- Chỉ trả về JSON array, không markdown, không giải thích ngoài JSON.

Schema JSON array:
[
  {
    "id": 1,
    "problem": "string - tóm tắt vấn đề thật, ngắn gọn 5-12 từ",
    "solution": "string - tên giải pháp AI cụ thể, triển khai được",
    "hoursImpact": 0,
    "impact": 1,
    "effort": 1,
    "isTop3": true,
    "assignee": "",
    "notes": "string - lý do chọn, dữ liệu nào ủng hộ, MVP nên làm gì"
  }
]

Dữ liệu thực tế Ngày 1-4:
${JSON.stringify(context, null, 2)}
`
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini chưa được cấu hình. Thiếu GEMINI_API_KEY.' }, { status: 500 })
  }

  if (!user.day1Data || !user.day2Data || !user.day3Data || !user.day4Data) {
    return NextResponse.json({ error: 'Cần hoàn tất dữ liệu Ngày 1, 2, 3, 4 trước khi đề xuất giải pháp AI tự động.' }, { status: 400 })
  }

  try {
    const client = new GoogleGenAI({ apiKey })
    const generated = await withGenerationTimeout(generateGeminiText(
      client,
      buildDay5Prompt(user),
      'Bạn chỉ trả về JSON array hợp lệ, không markdown, không code fence, không giải thích.'
    ))
    const parsed = extractJsonArray(generated.text)
    const suggestions = parsed.slice(0, 12).map((item: any, index: number) => ({
      id: index + 1,
      problem: normalizeProblemSummary(item.problem, index),
      solution: normalizeSolutionName(item.solution, index),
      hoursImpact: Number(item.hoursImpact || 0),
      impact: Math.min(5, Math.max(1, Number(item.impact || 3))),
      effort: Math.min(5, Math.max(1, Number(item.effort || 3))),
      isTop3: Boolean(item.isTop3),
      assignee: String(item.assignee || ''),
      notes: String(item.notes || '')
    })).filter((item: any) => item.problem && item.solution)

    const normalizedTop3 = suggestions
      .sort((a: any, b: any) => Number(b.isTop3) - Number(a.isTop3) || (b.impact - b.effort) - (a.impact - a.effort))
      .map((item: any, index: number) => ({ ...item, id: index + 1, isTop3: index < 3 }))

    if (normalizedTop3.length === 0) {
      return NextResponse.json({ error: 'Gemini chưa tạo được giải pháp hợp lệ từ dữ liệu Ngày 1-4.' }, { status: 500 })
    }

    await prisma.day5Data.upsert({
      where: { userId: user.id },
      update: { priorities: JSON.stringify(normalizedTop3) },
      create: { userId: user.id, priorities: JSON.stringify(normalizedTop3) }
    })

    return NextResponse.json({ success: true, suggestions: normalizedTop3, model: generated.model })
  } catch (error: any) {
    console.error('day5_suggest_error', { userId: user.id, message: error?.message, status: error?.status, code: error?.code })
    return NextResponse.json({ error: getPublicGenerationError(error) }, { status: 500 })
  }
}
