import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

const GOCLAW_GATEWAY_URL = process.env.GOCLAW_GATEWAY_URL || 'https://asnity-workspace-asnity.tose.sh'
const GOCLAW_GATEWAY_TOKEN = process.env.GOCLAW_GATEWAY_TOKEN || 'REDACTED_TOKEN'
const GOCLAW_AGENT_ID = process.env.GOCLAW_AGENT_ID || 'rai'

const PATH_TITLES: Record<string, string> = {
  '/': 'Trang chủ Bản đồ Hành động AI',
  '/dashboard': 'Bảng điều khiển Tổng quan',
  '/day-1': 'Ngày 1: Sự thật (Khám sức khỏe vận hành & Top 3 vấn đề)',
  '/day-2': 'Ngày 2: Tài chính & Quy mô (Quỹ lương, doanh thu, metrics)',
  '/day-3': 'Ngày 3: Phỏng vấn sâu (Lãnh đạo vs Thực thi, 5 Findings)',
  '/day-4': 'Ngày 4: Chuỗi giá trị 3 Động cơ (Acquisition, Delivery, Support)',
  '/day-5': 'Ngày 5: Ma trận ưu tiên Use-Case (Impact vs Effort, Top 3)',
  '/day-6': 'Ngày 6: Bài toán tài chính & ROI (Thời gian hoàn vốn Payback)',
  '/day-7': 'Ngày 7: Lộ trình 30-60-90 ngày (Roadmap hành động)',
  '/day-8': 'Ngày 8: Soạn thảo PRD Enterprise Multi-Agent (14 mục, Rubric 80đ)',
  '/day-9': 'Ngày 9: Thiết kế System Instruction (XML 5 thẻ cho Agent)',
  '/results': 'Báo cáo Kết quả Toàn diện Bản đồ Hành động'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages = [], currentPath = '/' } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Danh sách tin nhắn không hợp lệ' }, { status: 400 })
    }

    // Resolve user ID from session cookie if present
    let userId = 'guest'
    try {
      const cookieStore = await cookies()
      const sessionToken = cookieStore.get('session')?.value
      if (sessionToken) {
        const payload = await decrypt(sessionToken)
        if (payload?.userId) {
          userId = payload.userId
        }
      }
    } catch {
      // Guest mode
    }

    // Prepare messages for GoClaw
    // Enrich with path context on initial turn or if relevant
    const pathDescription = PATH_TITLES[currentPath] || currentPath
    const enrichedMessages = messages.map((m: { role: string; content: string }, index: number) => {
      // If it's the very first user message, subtly append the user's current location on the platform
      if (index === 0 && m.role === 'user') {
        return {
          role: 'user',
          content: `[Ngữ cảnh: Khách hàng đang xem trang "${pathDescription}"]\n\n${m.content}`
        }
      }
      return m
    })

    const targetUrl = `${GOCLAW_GATEWAY_URL.replace(/\/+$/, '')}/v1/chat/completions`

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GOCLAW_GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
        'X-GoClaw-User-Id': userId,
        'X-GoClaw-Agent-Id': GOCLAW_AGENT_ID
      },
      body: JSON.stringify({
        messages: enrichedMessages
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GoClaw Gateway Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Không thể kết nối tới AI Consultant RAI lúc này. Vui lòng thử lại sau.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const replyContent = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi chưa nhận được phản hồi phù hợp.'

    return NextResponse.json({
      reply: replyContent,
      agent: 'rai',
      usage: data.usage
    })
  } catch (err: any) {
    console.error('Chat RAI Route Error:', err)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi nội bộ khi xử lý tin nhắn.' },
      { status: 500 }
    )
  }
}
