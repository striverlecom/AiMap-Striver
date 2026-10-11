export type PrdStatus = 'pending' | 'generating' | 'completed' | 'failed'

export type PrdUseCase = {
  useCaseIndex: number
  useCaseTitle: string
  sourceProblem: string
  sourceSolution: string
  sourceType?: 'system' | 'custom'
  manualWorkflow?: string
  roiInput?: Record<string, unknown> | null
  roadmapContext?: Record<string, unknown> | null
}

export type PrdItem = PrdUseCase & {
  status: PrdStatus
  manualWorkflow: string
  markdown: string
  errorMessage: string | null
  model: string | null
  responseId: string | null
  generatedAt: string | null
}

export const PRD_REQUIRED_SECTIONS = [
  { name: 'Thẻ điều hành', aliases: ['Thẻ điều hành', 'Executive'] },
  { name: 'Ngữ cảnh người dùng', aliases: ['Ngữ cảnh người dùng', 'User Context'] },
  { name: 'Kiến trúc quy trình', aliases: ['Kiến trúc quy trình', 'Process Architecture'] },
  { name: 'Data Workflow JSON', aliases: ['Data Workflow JSON'] },
  { name: 'Data Flow Map', aliases: ['Data Flow Map'] },
  { name: 'Concrete Example', aliases: ['Concrete Example', 'Ví dụ dữ liệu'] },
  { name: 'RCICE', aliases: ['RCICE'] },
  { name: 'INPUT SCHEMA', aliases: ['INPUT SCHEMA', 'Input Schema'] },
  { name: 'OUTPUT SCHEMA', aliases: ['OUTPUT SCHEMA', 'Output Schema'] },
  { name: 'Knowledge Base Strategy', aliases: ['Knowledge Base Strategy', 'Chiến lược cơ sở tri thức'] },
  { name: 'Human-in-the-loop', aliases: ['Human-in-the-loop', 'Human in the loop', 'HITL'] },
  { name: 'Failure Paths', aliases: ['Failure Paths', 'Đường lỗi', 'Luồng lỗi'] },
  { name: 'Evaluation Framework', aliases: ['Evaluation Framework', 'Khung đánh giá'] },
  { name: 'Roadmap', aliases: ['Roadmap', 'Lộ trình'] },
  { name: 'Open Questions', aliases: ['Open Questions', 'Open Questions/TODO', 'Câu hỏi mở', 'Câu hỏi/TODO', 'TODO'] }
]

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function extractPrdUseCases(user: any): PrdUseCase[] {
  const priorities = safeJsonParse<any[]>(user?.day5Data?.priorities, [])
  const roiData = safeJsonParse<any[]>(user?.day6Data?.roiData, [])
  const roadmap = safeJsonParse<Record<string, unknown>>(user?.day7Data?.roadmap, {})
  let topSolutions = priorities.filter(item => item?.isTop3).slice(0, 3)

  if (topSolutions.length === 0 && priorities.length > 0) {
    topSolutions = [...priorities].sort((a, b) => {
      const scoreA = (Number(a.impact) || 3) / (Number(a.effort) || 3)
      const scoreB = (Number(b.impact) || 3) / (Number(b.effort) || 3)
      return scoreB - scoreA
    }).slice(0, 3)
  }

  if (topSolutions.length === 0 && roiData.length > 0) {
    topSolutions = roiData.slice(0, 3).map((r, i) => ({
      solution: r.name || `Giải pháp #${i + 1}`,
      problem: r.desc || '',
      isTop3: true
    }))
  }

  return topSolutions.map((item, index) => {
    const roi = roiData[index] || null
    const sourceSolution = String(item?.solution || roi?.name || item?.problem || `Giải pháp #${index + 1}`).trim()
    const sourceProblem = String(item?.problem || '').trim()

    return {
      useCaseIndex: index + 1,
      useCaseTitle: sourceSolution || `Giải pháp #${index + 1}`,
      sourceProblem,
      sourceSolution,
      sourceType: 'system',
      roiInput: roi,
      roadmapContext: roadmap
    }
  })
}

export function buildBlankCustomUseCases(count = 3): PrdUseCase[] {
  return Array.from({ length: count }, (_, index) => ({
    useCaseIndex: index + 1,
    useCaseTitle: '',
    sourceProblem: '',
    sourceSolution: '',
    sourceType: 'custom' as const,
    manualWorkflow: '',
    roiInput: null,
    roadmapContext: null
  }))
}

export function normalizeCustomUseCases(value: unknown): PrdUseCase[] {
  if (!Array.isArray(value)) return []

  return value.slice(0, 3).map((item, index) => {
    const useCaseTitle = String(item?.useCaseTitle || item?.title || '').trim()
    const sourceProblem = String(item?.sourceProblem || item?.problem || '').trim()
    const sourceSolution = String(item?.sourceSolution || item?.solution || useCaseTitle).trim()
    const manualWorkflow = String(item?.manualWorkflow || '').trim()

    return {
      useCaseIndex: index + 1,
      useCaseTitle,
      sourceProblem,
      sourceSolution,
      sourceType: 'custom' as const,
      manualWorkflow,
      roiInput: null,
      roadmapContext: null
    }
  }).filter(item => item.useCaseTitle || item.sourceProblem || item.sourceSolution || item.manualWorkflow)
}

export function mergePrdItems(existing: PrdItem[], useCases: PrdUseCase[]): PrdItem[] {
  return useCases.map(useCase => {
    const old = existing.find(item => item.useCaseIndex === useCase.useCaseIndex && (!useCase.sourceType || !item.sourceType || item.sourceType === useCase.sourceType))
    let status = old?.status || 'pending'
    let errorMessage = old?.errorMessage || null
    if (status === 'generating' && old?.markdown) {
      status = 'completed'
      errorMessage = null
    } else if (status === 'generating' && old?.generatedAt) {
      const ageMs = Date.now() - new Date(old.generatedAt).getTime()
      if (Number.isFinite(ageMs) && ageMs > 10 * 60 * 1000) {
        status = 'failed'
        errorMessage = 'Lần tạo trước bị ngắt do timeout. Vui lòng bấm tạo lại PRD này.'
      }
    }

    return {
      ...useCase,
      status,
      manualWorkflow: useCase.manualWorkflow || old?.manualWorkflow || '',
      markdown: old?.markdown || '',
      errorMessage,
      model: old?.model || null,
      responseId: old?.responseId || null,
      generatedAt: old?.generatedAt || null
    }
  })
}

export function getMissingPrdSections(markdown: string) {
  const lower = markdown.toLowerCase()
  return PRD_REQUIRED_SECTIONS
    .filter(section => !section.aliases.some(alias => lower.includes(alias.toLowerCase())))
    .map(section => section.name)
}

export function slugifyFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'prd'
}

export function buildPrdPrompt(useCase: PrdUseCase, user: any) {
  let companyInfo = { companyName: '', authorName: '' }
  try {
    const p = safeJsonParse<any>(user?.day2Data?.parameters, {})
    companyInfo = {
      companyName: p.companyName || '',
      authorName: p.authorName || ''
    }
  } catch {}

  const salaryData = safeJsonParse<any[]>(user?.day2Data?.salaryData, [])
  const mapData = safeJsonParse<Record<string, any>>(user?.day4Data?.mapData, {})
  const top3Problems = safeJsonParse<any[]>(user?.day1Data?.top3Problems, [])

  const businessContext = {
    company: companyInfo.companyName || 'Doanh nghiệp SME Việt Nam',
    author: companyInfo.authorName || 'Chủ doanh nghiệp',
    selectedUseCase: useCase,
    identifiedProblems: top3Problems,
    keyDepartments: salaryData.map(d => ({ title: d.title, count: d.count })),
    processMapHighlights: Object.keys(mapData).map(dept => ({
      dept,
      issues: Array.isArray(mapData[dept]) ? mapData[dept].filter((x: any) => x.issues || x.wastedTime).map((x: any) => x.step) : []
    }))
  }

  return `
Bạn là StriverAI PRD, chuyên gia kiến trúc giải pháp Enterprise Multi-Agent Systems. Hãy tạo một bản PRD Markdown hoàn chỉnh, chuyên sâu và thực chiến cho use-case sau.

Yêu cầu bắt buộc:
- Chỉ trả về Markdown thô, không bọc trong code fence ngoài cùng.
- Bắt đầu bằng: # PRD: ${useCase.useCaseTitle}
- Viết tiếng Việt chuyên nghiệp, gãy gọn, chuẩn ngôn ngữ kỹ thuật phần mềm.
- Không tóm tắt, không viết tắt. Triển khai sâu sắc, chi tiết từng phần.
- Mọi tên Agent phải dùng format "Agent + Chức năng chính", ví dụ "Agent Phân Loại Ý Định", "Agent Trích Xuất Dữ Liệu".
- Mỗi Agent BẮT BUỘC phải được chỉ định Autonomy Tier rõ ràng:
  * L0 – Read-Only (Chỉ đọc dữ liệu)
  * L1 – Draft / Propose (Soạn thảo đề xuất, BẮT BUỘC người duyệt trước khi phát tán)
  * L2 – Execute with Guardrails (Tự thực thi trong ngưỡng an toàn định lượng)
  * L3 – Full Autonomy (Tự chủ hoàn toàn cho tác vụ nội bộ rủi ro thấp)
- Mục 8: Bắt buộc cung cấp đầy đủ JSON Schema chuẩn (có type, properties, required, description) cho cả INPUT SCHEMA và OUTPUT SCHEMA.
- Mục 11: Bắt buộc cung cấp ma trận bảng Failure Paths (Model Hallucination, API Timeout, Vượt hạn mức, Khách khiếu nại gay gắt) và điểm chặn con người (Human-in-the-loop Approval Queue).
- Phải gắn liền với "Mô tả luồng thủ công thực tế" và "Bối cảnh doanh nghiệp thực tế" bên dưới để thiết kế các Agent giải quyết đúng nỗi đau của họ.
- Nếu thiếu dữ liệu, ghi {TODO - Nghiêm trọng}, {TODO - Quan trọng}, hoặc {TODO - Nên biết}; tuyệt đối không bịa đặt.

Danh sách 14 phần bắt buộc triển khai:
1. Thẻ điều hành (Executive Summary: Bối cảnh, Mục tiêu định lượng ROI, Phạm vi In-scope & Out-of-scope)
2. Ngữ cảnh người dùng (Đối tượng vận hành, Nỗi đau và lỗi thường gặp trong quy trình hiện tại)
3. Kiến trúc quy trình tự động hóa (Sơ đồ luồng mới To-Be, vai trò Con người vs Multi-Agent)
4. Data Workflow JSON (Cấu trúc định tuyến luồng dữ liệu chuẩn JSON)
5. Data Flow Map (Bản đồ luồng đi của dữ liệu từ nguồn vào, làm sạch PII, qua các Agent đến hệ thống đích)
6. Concrete Example (01 kịch bản cụ thể: Input thực tế -> Bước xử lý trung gian -> Output hoàn chỉnh)
7. Đặc tả Agent theo mô hình RCICE (Role, Context, Instructions, Constraints, Examples)
8. INPUT SCHEMA và OUTPUT SCHEMA (Đặc tả JSON Schema chuẩn cho từng Agent)
9. Knowledge Base Strategy (Nguồn tài liệu, chiến lược Vector Embeddings, Chunking, Hybrid Search)
10. Integration & Technical Requirements (Giao thức MCP / REST API / Webhooks, Zalo OA, CRM, Docker/PostgreSQL)
11. Human-in-the-loop & Failure Paths Matrix (Ma trận xử lý đường lỗi, timeout, rào chắn an ninh & hàng đợi phê duyệt)
12. Evaluation Framework (Chỉ số kỹ thuật: Latency, Accuracy, Token budget và chỉ số kinh doanh CSAT, Resolution Time)
13. Roadmap & Risks (Lộ trình 3 giai đoạn: Prototype -> Pilot -> Production & Giảm thiểu rủi ro bảo mật)
14. Open Questions/TODOs (Phân loại: TODO Nghiêm trọng, TODO Quan trọng, TODO Nên biết)

Use-case AI:
${JSON.stringify(useCase, null, 2)}

Mô tả luồng thủ công thực tế do người dùng nhập cho use-case này:
${useCase.manualWorkflow?.trim() || '{TODO - Nghiêm trọng: Chưa có mô tả luồng thủ công thực tế}'}

Ngữ cảnh doanh nghiệp thực tế từ các ngày kiểm toán trước:
${JSON.stringify(businessContext, null, 2)}
`
}
