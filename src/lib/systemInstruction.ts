import { safeJsonParse, type PrdItem } from './prd'

export { safeJsonParse }

export type SiStatus = 'pending' | 'generating' | 'completed' | 'failed'

export type SiItem = {
  useCaseIndex: number
  useCaseTitle: string
  status: SiStatus
  markdown: string
  errorMessage: string | null
  model: string | null
  generatedAt: string | null
}

export const SI_REQUIRED_SECTIONS = [
  { name: '<role>', aliases: ['<role>'] },
  { name: '<context>', aliases: ['<context>'] },
  { name: '<instructions>', aliases: ['<instructions>'] },
  { name: '<criteria>', aliases: ['<criteria>'] },
  { name: '<examples>', aliases: ['<examples>'] },
  { name: '```xml', aliases: ['```xml'] },
  { name: 'Input JSON Schema', aliases: ['Input JSON Schema', 'Input schema'] },
  { name: 'Output JSON Schema', aliases: ['Output JSON Schema', 'Output schema'] },
  { name: 'Happy path', aliases: ['Happy path', 'Ví dụ 1'] },
  { name: 'Edge case', aliases: ['Edge case', 'Ví dụ 2'] }
]

export function extractCompletedPrds(day8Data: any): PrdItem[] {
  return safeJsonParse<PrdItem[]>(day8Data?.prdData, []).filter(item => item.status === 'completed' && item.markdown?.trim())
}

export function mergeSiItems(existing: SiItem[], prds: PrdItem[]): SiItem[] {
  return prds.map(prd => {
    const old = existing.find(item => item.useCaseIndex === prd.useCaseIndex)
    const isSameTitle = old?.useCaseTitle?.trim().toLowerCase() === prd.useCaseTitle?.trim().toLowerCase()
    const matchedOld = isSameTitle ? old : undefined

    let status = matchedOld?.status || 'pending'
    let errorMessage = matchedOld?.errorMessage || null

    if (status === 'generating' && matchedOld?.markdown) {
      status = 'completed'
      errorMessage = null
    } else if (status === 'generating' && matchedOld?.generatedAt) {
      const ageMs = Date.now() - new Date(matchedOld.generatedAt).getTime()
      if (Number.isFinite(ageMs) && ageMs > 10 * 60 * 1000) {
        status = 'failed'
        errorMessage = 'Lần tạo trước bị ngắt do timeout. Vui lòng bấm tạo lại System Instruction này.'
      }
    }

    return {
      useCaseIndex: prd.useCaseIndex,
      useCaseTitle: prd.useCaseTitle,
      status,
      markdown: matchedOld?.markdown || '',
      errorMessage,
      model: matchedOld?.model || null,
      generatedAt: matchedOld?.generatedAt || null
    }
  })
}

export function getMissingSiSections(markdown: string) {
  const lower = markdown.toLowerCase()
  return SI_REQUIRED_SECTIONS
    .filter(section => !section.aliases.some(alias => lower.includes(alias.toLowerCase())))
    .map(section => section.name)
}

export function buildSiPrompt(prd: PrdItem) {
  return `
Bạn là StriverAI SI. Hãy đọc PRD bên dưới và tạo System Instruction production-ready cho TẤT CẢ Agent xuất hiện trong PRD của use-case này.

Yêu cầu đầu ra bắt buộc:
- Trả về Markdown thô.
- Bắt đầu bằng: # System Instructions: ${prd.useCaseTitle}
- Trước khi viết System Instruction, liệt kê danh sách Agent sẽ được đặc tả để đảm bảo không Agent nào bị bỏ sót.
- Mỗi Agent bắt đầu bằng header: [Số thứ tự]. [Tên Agent tiếng Việt].
- Tên Agent phải theo format "Agent + Chức năng chính". Nếu PRD có tên chưa chuẩn, tự chuẩn hóa trong im lặng.
- Toàn bộ System Instruction của từng Agent PHẢI đặt trong code fence \`\`\`xml ... \`\`\`.
- Trong mỗi code fence xml, giữ đúng 5 XML tags theo thứ tự: <role>, <context>, <instructions>, <criteria>, <examples>.
- Mỗi <role> có 3-5 đoạn/câu đủ rõ: Agent là ai, chuyên môn, định vị trong hệ thống, tính cách, điều không làm.
- Mỗi <context> có môi trường hoạt động và Input JSON Schema đầy đủ.
- Mỗi <instructions> có tối thiểu 4 bước đánh số, mỗi bước 2-4 câu; có logic rẽ nhánh, xử lý lỗi và Output JSON Schema ở bước cuối.
- Mỗi <criteria> có tối thiểu 5 tiêu chí, mỗi tiêu chí có ngưỡng đo lường cụ thể.
- Mỗi <examples> có ít nhất 2 ví dụ: 1 happy path và 1 edge case, mỗi ví dụ có Input, Phân tích và Dữ liệu JSON output đầy đủ.
- Không tóm tắt, không bỏ agent, không viết bản phác thảo.
- Nếu thiếu dữ liệu trong PRD, dùng {TODO - Nghiêm trọng}, {TODO - Quan trọng}, hoặc {TODO - Nên biết}; không bịa.

PRD nguồn của use-case:
${prd.markdown}
`
}
