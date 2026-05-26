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
  const topSolutions = priorities.filter(item => item?.isTop3).slice(0, 3)

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
  const businessContext = {
    day1Score: user?.day1Data?.totalScore || null,
    day2Parameters: safeJsonParse(user?.day2Data?.parameters, {}),
    day2Challenges: safeJsonParse(user?.day2Data?.challenges, {}),
    day3InterviewData: safeJsonParse(user?.day3Data?.interviewData, {}),
    day4MapData: safeJsonParse(user?.day4Data?.mapData, {}),
    day5Priorities: safeJsonParse(user?.day5Data?.priorities, []),
    selectedUseCase: useCase,
    contextUsageInstruction: 'Bắt buộc dùng dữ liệu Ngày 1, 2, 3, 4, 5 cùng mô tả luồng thủ công để thiết kế PRD sát thực tế. Nếu dữ liệu hệ thống và mô tả luồng thủ công khác nhau, ưu tiên mô tả luồng cho chi tiết thao tác, nhưng vẫn dùng dữ liệu Ngày 1-5 để hiệu chỉnh mục tiêu, ràng buộc, người dùng, vấn đề và tiêu chí thành công.'
  }

  return `
Bạn là StriverAI PRD. Hãy tạo một PRD Markdown hoàn chỉnh cho use-case AI sau.

Yêu cầu bắt buộc:
- Chỉ trả về Markdown thô, không bọc trong code fence.
- Bắt đầu bằng: # PRD: ${useCase.useCaseTitle}
- Viết tiếng Việt.
- Không tóm tắt. Triển khai đầy đủ từng phần.
- Mọi tên Agent phải dùng format "Agent + Chức năng chính", ví dụ "Agent Phân Tích Quy Trình".
- PRD phải có Data Workflow JSON, Data Flow Map, Concrete Example, RCICE, INPUT SCHEMA, OUTPUT SCHEMA, failure paths, human-in-the-loop, evaluation rubric và roadmap.
- Phải dùng "Mô tả luồng thủ công thực tế" bên dưới làm dữ liệu đầu vào chính để thiết kế workflow, Agent, schema, failure paths và roadmap. Không được chỉ dựa vào tên use-case.
- Nếu thiếu dữ liệu, ghi {TODO - Nghiêm trọng}, {TODO - Quan trọng}, hoặc {TODO - Nên biết}; không bịa.
- Dùng knowledge pack PRD được cung cấp trong ngữ cảnh hệ thống làm chuẩn cấu trúc PRD.

Danh sách phần phải triển khai:
1. Thẻ điều hành
2. Ngữ cảnh người dùng
3. Kiến trúc quy trình
4. Data Workflow JSON
5. Data Flow Map
6. Concrete Example
7. Đặc tả Agent theo RCICE
8. INPUT SCHEMA và OUTPUT SCHEMA cho từng Agent
9. Knowledge Base Strategy
10. Integration & Technical Requirements
11. Human-in-the-loop & Failure Paths
12. Evaluation Framework
13. Roadmap & Risks
14. Open Questions/TODO

Use-case AI:
${JSON.stringify(useCase, null, 2)}

Mô tả luồng thủ công thực tế do người dùng nhập cho use-case này:
${useCase.manualWorkflow?.trim() || '{TODO - Nghiêm trọng: Chưa có mô tả luồng thủ công thực tế}'}

Ngữ cảnh doanh nghiệp từ 7 ngày:
${JSON.stringify(businessContext, null, 2)}
`
}
