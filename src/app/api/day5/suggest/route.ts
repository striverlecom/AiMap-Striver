import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/auth'
import { safeJsonParse } from '@/lib/prd'
import { generateGeminiText, getPublicGenerationError, withGenerationTimeout } from '@/lib/geminiPrd'
import { getGeminiApiKey } from '@/lib/geminiConfig'

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
  const salaryList = safeJsonParse(user.day2Data?.salaryData, [])
  const context = {
    day1: {
      totalScore: user.day1Data?.totalScore ?? null,
      top3Problems: safeJsonParse(user.day1Data?.top3Problems, []),
      evidenceData: safeJsonParse(user.day1Data?.evidenceData, {}),
      notes: user.day1Data?.notes || ''
    },
    day2_tai_chinh_va_luong: {
      revenue: user.day2Data?.revenue ?? null,
      targetRevenue: user.day2Data?.targetRevenue ?? null,
      salaryCost: user.day2Data?.salaryCost ?? null,
      customerCount: user.day2Data?.customerCount ?? null,
      churnRate: user.day2Data?.churnRate ?? null,
      avgOrderTime: user.day2Data?.avgOrderTime ?? null,
      bang_luong_phong_ban: Array.isArray(salaryList) ? salaryList.map((s: any) => ({
        phong_ban: s.department,
        so_nhan_su: s.count,
        luong_thang_tb: s.salary
      })) : [],
      challenges: safeJsonParse(user.day2Data?.challenges, {}),
      parameters: safeJsonParse(user.day2Data?.parameters, {})
    },
    day3_phong_van_nhan_su: {
      interviewData: safeJsonParse(user.day3Data?.interviewData, {})
    },
    day4_so_do_quy_trinh_3_dong_co: {
      mapData: safeJsonParse(user.day4Data?.mapData, {})
    }
  }

  return `
Bạn là chuyên gia tư vấn chiến lược AI và tối ưu hóa vận hành (AI Agency Principal Consultant) hàng đầu cho doanh nghiệp SME.

Nhiệm vụ: Dựa vào toàn bộ dữ liệu thực tế Ngày 1, Ngày 2, Ngày 3, Ngày 4 bên dưới để đề xuất danh sách giải pháp cho Ngày 5. Không dùng dữ liệu mẫu. Không bịa thông tin ngoài dữ liệu người dùng cung cấp.

TƯ DUY TƯ VẤN CỐT LÕI (RẤT QUAN TRỌNG):
1. GIÁ TRỊ CỦA CHUYÊN GIA LÀ NÓI "KHÔNG" VỚI AI KHI CHƯA CẦN THIẾT:
   - Nếu một vấn đề bắt nguồn từ việc thiếu kỷ luật, giao việc miệng, quy trình chưa chuẩn, hoặc dữ liệu chưa được số hóa:
     ➔ Hãy phân loại là "process_only" (Tối ưu quy trình).
     ➔ Tên solution: Đặt tên rõ, ví dụ "Chuẩn Hóa SOP Bàn Giao", "Biểu Mẫu Google Form", "Bảng Theo Dõi Khách Hàng".
     ➔ Ghi rõ trong notes: Khuyên doanh nghiệp KHÔNG NÊN mua công cụ AI cho việc này, mà phải chuẩn hóa biểu mẫu/SOP trước để tránh lãng phí tiền.
     ➔ Trường solutionType = "process_only". Không đưa vào Top 3.
   - Nếu một vấn đề lặp đi lặp lại thao tác xử lý văn bản, trả lời khách hàng 24/7, bóc tách tài liệu, tóm tắt dữ liệu, phân loại lead:
     ➔ Hãy phân loại là "ai_solution". Trường solutionType = "ai_solution".

2. TÍNH TOÁN hoursImpact GẮN CHẶT VỚI BẢNG LƯƠNG NGÀY 2:
   - Hãy đối chiếu với số lượng nhân sự của phòng ban chịu ảnh hưởng trong bang_luong_phong_ban ở Ngày 2.
   - hoursImpact là TỔNG SỐ GIỜ LÃNG PHÍ MỖI TUẦN CỦA TOÀN BỘ NHÂN SỰ LIÊN QUAN (Ví dụ: 3 nhân viên sales x 4h/tuần = 12h/tuần).

3. ĐỀ XUẤT GIẢI PHÁP AI CỤ THỂ, KHẢ THI (MVP ĐƯỢC NGAY):
   - Không đặt tên chung chung như "dùng ChatGPT". Hãy đặt tên use-case rõ ràng: "AI Chấm Lead", "AI Soạn Báo Giá", "AI Phản Hồi CSKH", "AI Tóm Tắt Đơn".
   - Tên solution: 2-5 từ tiếng Việt, tối đa 45 ký tự.
   - Chấm impact (1-5) và effort (1-5).
   - Chọn ra ĐÚNG 3 giải pháp AI có ROI và tính khả thi cao nhất để gán isTop3 = true.

Schema JSON array:
[
  {
    "id": 1,
    "problem": "string - tóm tắt ngắn gọn vấn đề thật (5-12 từ, tối đa 80 ký tự)",
    "solution": "string - tên giải pháp ngắn gọn (2-5 từ, tối đa 45 ký tự)",
    "solutionType": "ai_solution hoặc process_only",
    "hoursImpact": 0,
    "impact": 1,
    "effort": 1,
    "isTop3": true,
    "assignee": "",
    "notes": "string - lý do chuyên gia tư vấn: vì sao nên làm AI hoặc vì sao chỉ nên chuẩn hóa SOP"
  }
]

Dữ liệu thực tế doanh nghiệp:
${JSON.stringify(context, null, 2)}
`
}


export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isPaid) return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const apiKey = getGeminiApiKey()
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
    const suggestions = parsed.slice(0, 12).map((item: any, index: number) => {
      const isProcessOnly = item.solutionType === 'process_only' ||
        (/quy\s*trình|sop|form|sheet|excel/i.test(item.solution || '') && !/ai|agent|bot|gpt/i.test(item.solution || ''))
      return {
        id: index + 1,
        problem: normalizeProblemSummary(item.problem, index),
        solution: normalizeSolutionName(item.solution, index),
        solutionType: isProcessOnly ? 'process_only' : 'ai_solution',
        hoursImpact: Number(item.hoursImpact || 0),
        impact: Math.min(5, Math.max(1, Number(item.impact || 3))),
        effort: Math.min(5, Math.max(1, Number(item.effort || 3))),
        isTop3: isProcessOnly ? false : Boolean(item.isTop3),
        assignee: String(item.assignee || ''),
        notes: String(item.notes || '')
      }
    }).filter((item: any) => item.problem && item.solution)

    const aiSolutions = suggestions.filter((s: any) => s.solutionType === 'ai_solution')
    const processSolutions = suggestions.filter((s: any) => s.solutionType === 'process_only')

    const sortedAi = aiSolutions
      .sort((a: any, b: any) => (b.impact - b.effort) - (a.impact - a.effort) || b.hoursImpact - a.hoursImpact)
      .map((item: any, index: number) => ({ ...item, isTop3: index < 3 }))

    const normalizedTop3 = [...sortedAi, ...processSolutions].map((item: any, index: number) => ({
      ...item,
      id: index + 1
    }))

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
