import { PRD_REQUIRED_SECTIONS } from './prd'

export interface PrdRubricItem {
  id: string
  title: string
  score: number
  maxScore: number
  status: 'pass' | 'warn' | 'fail'
  details: string
}

export interface PrdEvaluationResult {
  totalScore: number
  grade: 'Đạt Chuẩn Cấu Trúc (Tham Khảo)' | 'Đạt Chuẩn (Chấp Nhận Được)' | 'Cần Hoàn Thiện Thêm'
  gradeColor: string
  rubrics: {
    structure: PrdRubricItem
    technical: PrdRubricItem
    hitl: PrdRubricItem
    resilience: PrdRubricItem
  }
  missingSections: string[]
  strengths: string[]
  improvements: string[]
}

export function evaluatePrdQuality(markdown: string): PrdEvaluationResult {
  if (!markdown || typeof markdown !== 'string' || markdown.trim().length === 0) {
    return {
      totalScore: 0,
      grade: 'Cần Hoàn Thiện Thêm',
      gradeColor: 'var(--error)',
      rubrics: {
        structure: { id: 'structure', title: 'Cấu Trúc & Độ Đầy Đủ', score: 0, maxScore: 25, status: 'fail', details: 'Chưa có nội dung PRD' },
        technical: { id: 'technical', title: 'Đặc Tả Kỹ Thuật & Schema', score: 0, maxScore: 25, status: 'fail', details: 'Thiếu schema dữ liệu' },
        hitl: { id: 'hitl', title: 'Human-in-the-Loop & Governance', score: 0, maxScore: 25, status: 'fail', details: 'Thiếu cơ chế phê duyệt' },
        resilience: { id: 'resilience', title: 'Xử Lý Lỗi & Dự Phòng', score: 0, maxScore: 25, status: 'fail', details: 'Thiếu ma trận lỗi' }
      },
      missingSections: PRD_REQUIRED_SECTIONS.map(s => s.name),
      strengths: [],
      improvements: ['Vui lòng tạo bản PRD hoàn chỉnh trước khi thẩm định.']
    }
  }

  const text = markdown
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).length

  // 1. DIMENSION 1: Cấu Trúc & Độ Đầy Đủ (Max 25đ)
  const missingSections: string[] = []
  let detectedSectionsCount = 0

  PRD_REQUIRED_SECTIONS.forEach(sec => {
    const hasAlias = sec.aliases.some(alias => lower.includes(alias.toLowerCase()))
    if (hasAlias) {
      detectedSectionsCount++
    } else {
      missingSections.push(sec.name)
    }
  })

  let structureScore = Math.round((detectedSectionsCount / PRD_REQUIRED_SECTIONS.length) * 18)
  if (wordCount >= 1800) structureScore += 7
  else if (wordCount >= 1000) structureScore += 5
  else if (wordCount >= 500) structureScore += 3
  structureScore = Math.min(25, Math.max(0, structureScore))

  const structureStatus = structureScore >= 20 ? 'pass' : structureScore >= 14 ? 'warn' : 'fail'
  const structureDetails = `Đã phát hiện ${detectedSectionsCount}/${PRD_REQUIRED_SECTIONS.length} mục cốt lõi (~${wordCount.toLocaleString()} từ).`

  // 2. DIMENSION 2: Đặc Tả Kỹ Thuật & Schema (Max 25đ)
  let technicalScore = 0
  const hasJsonBlocks = /```(?:json)?[\s\S]*?\{[\s\S]*?\}[\s\S]*?```/i.test(text)
  const hasInputSchema = /input\s+schema/i.test(text) && (lower.includes('"type"') || lower.includes('string') || lower.includes('object'))
  const hasOutputSchema = /output\s+schema/i.test(text) && (lower.includes('"type"') || lower.includes('string') || lower.includes('object'))
  const hasAgentFormat = /agent\s+[A-ZÀ-Ỹa-zà-ỹ]+/i.test(text)
  const hasDataWorkflow = /data\s+workflow|data\s+flow/i.test(text)

  if (hasJsonBlocks) technicalScore += 6
  if (hasInputSchema) technicalScore += 6
  if (hasOutputSchema) technicalScore += 6
  if (hasAgentFormat) technicalScore += 4
  if (hasDataWorkflow) technicalScore += 3
  technicalScore = Math.min(25, Math.max(0, technicalScore))

  const technicalStatus = technicalScore >= 20 ? 'pass' : technicalScore >= 13 ? 'warn' : 'fail'
  const technicalDetails = hasInputSchema && hasOutputSchema 
    ? 'Đã chuẩn hoá INPUT/OUTPUT Schema dạng JSON có cấu trúc rõ ràng.' 
    : 'Còn thiếu hoặc chưa rõ định nghĩa kiểu dữ liệu (Schema) cho Agent.'

  // 3. DIMENSION 3: Human-in-the-Loop & Governance (Max 25đ)
  let hitlScore = 0
  const hasAutonomyTiers = /\b(?:L0|L1|L2|L3|Tier\s*[1-4])\b/i.test(text)
  const hasHumanCheckpoint = /human|con\s+người|duyệt|phê\s+duyệt|kiểm\s+duyệt|người\s+dùng/i.test(text)
  const hasDataSecurity = /bảo\s+mật|pii|quyền|an\s+ninh|phân\s+quyền|bí\s+mật/i.test(text)
  const hasRcice = /rcice|role.*context.*instruction/i.test(text)

  if (hasAutonomyTiers) hitlScore += 7
  if (hasHumanCheckpoint) hitlScore += 8
  if (hasDataSecurity) hitlScore += 5
  if (hasRcice) hitlScore += 5
  hitlScore = Math.min(25, Math.max(0, hitlScore))

  const hitlStatus = hitlScore >= 20 ? 'pass' : hitlScore >= 14 ? 'warn' : 'fail'
  const hitlDetails = hasAutonomyTiers && hasHumanCheckpoint
    ? 'Đã phân cấp Autonomy Tier (L0–L3) và có điểm chặn người duyệt (Approval Checkpoint).'
    : 'Cần làm rõ ranh giới tự động hóa và người có quyền bấm duyệt quyết định.'

  // 4. DIMENSION 4: Xử Lý Lỗi & Dự Phòng (Resilience & Failure Paths) (Max 25đ)
  let resilienceScore = 0
  const hasFailurePaths = /failure\s+path|đường\s+lỗi|luồng\s+lỗi|ngoại\s+lệ/i.test(text)
  const hasFallbackStrategy = /fallback|thay\s+thế|dự\s+phòng|retry|thử\s+lại|timeout/i.test(text)
  const hasHallucinationDefense = /hallucination|bịa|độ\s+tin\s+cậy|confidence/i.test(text)
  const hasExplicitTodo = /\{TODO\s*-\s*(?:Nghiêm trọng|Quan trọng|Nên biết)/i.test(text)

  if (hasFailurePaths) resilienceScore += 8
  if (hasFallbackStrategy) resilienceScore += 7
  if (hasHallucinationDefense) resilienceScore += 5
  if (hasExplicitTodo) resilienceScore += 5 // Điểm cộng vì trung thực, không bịa dữ liệu thiếu
  resilienceScore = Math.min(25, Math.max(0, resilienceScore))

  const resilienceStatus = resilienceScore >= 20 ? 'pass' : resilienceScore >= 14 ? 'warn' : 'fail'
  const resilienceDetails = hasFailurePaths && hasFallbackStrategy
    ? 'Đã có ma trận xử lý lỗi, cơ chế timeout và kịch bản dự phòng khi AI không chắc chắn.'
    : 'Cần bổ sung các đường rẽ nhánh khi API timeout hoặc dữ liệu đầu vào không hợp lệ.'

  // TỔNG KẾT
  let totalScore = structureScore + technicalScore + hitlScore + resilienceScore

  // Phòng thủ chống nhồi từ khóa: Văn bản dưới 350 từ không thể đạt điểm cao
  if (wordCount < 350) {
    totalScore = Math.min(totalScore, 55)
  }

  let grade: PrdEvaluationResult['grade'] = 'Cần Hoàn Thiện Thêm'
  let gradeColor = 'var(--error)'
  if (totalScore >= 80) {
    grade = 'Đạt Chuẩn Cấu Trúc (Tham Khảo)'
    gradeColor = 'var(--success)'
  } else if (totalScore >= 60) {
    grade = 'Đạt Chuẩn (Chấp Nhận Được)'
    gradeColor = '#f5a623'
  }

  // Strengths & Improvements
  const strengths: string[] = []
  const improvements: string[] = []

  if (detectedSectionsCount >= 13) strengths.push('Cấu trúc 14 phần đầy đủ theo tiêu chuẩn Enterprise Architect.')
  if (hasInputSchema && hasOutputSchema) strengths.push('Đặc tả Input/Output Schemas chuẩn JSON, lập trình viên có thể code ngay.')
  if (hasAutonomyTiers) strengths.push('Phân định rõ cấp độ tự chủ Autonomy Tier (L0–L3) để tránh rủi ro AI vượt quyền.')
  if (hasFailurePaths) strengths.push('Có kịch bản xử lý đường lỗi (Failure Paths) và cơ chế Human-in-the-loop bảo vệ.')
  if (hasExplicitTodo) strengths.push('Tuân thủ nguyên tắc "Không bịa đặt", đánh dấu TODO minh bạch các điểm thiếu dữ liệu.')

  if (missingSections.length > 0) {
    improvements.push(`Bổ sung các mục còn thiếu: ${missingSections.slice(0, 3).join(', ')}${missingSections.length > 3 ? '...' : ''}.`)
  }
  if (!hasInputSchema || !hasOutputSchema) {
    improvements.push('Chi tiết hóa Schema dữ liệu đầu vào và đầu ra dưới dạng JSON Schema.')
  }
  if (!hasAutonomyTiers) {
    improvements.push('Bổ sung phân cấp Autonomy Tier (L0 đến L3) cho từng Agent.')
  }
  if (!hasFailurePaths) {
    improvements.push('Bổ sung ma trận Failure Paths khi API lỗi hoặc khách hàng khiếu nại.')
  }

  return {
    totalScore,
    grade,
    gradeColor,
    rubrics: {
      structure: { id: 'structure', title: 'Cấu Trúc & Khối Lượng', score: structureScore, maxScore: 25, status: structureStatus, details: structureDetails },
      technical: { id: 'technical', title: 'Kỹ Thuật & JSON Schema', score: technicalScore, maxScore: 25, status: technicalStatus, details: technicalDetails },
      hitl: { id: 'hitl', title: 'Human-in-the-Loop & Phân Quyền', score: hitlScore, maxScore: 25, status: hitlStatus, details: hitlDetails },
      resilience: { id: 'resilience', title: 'Xử Lý Sự Cố & Fallback', score: resilienceScore, maxScore: 25, status: resilienceStatus, details: resilienceDetails }
    },
    missingSections,
    strengths,
    improvements
  }
}
