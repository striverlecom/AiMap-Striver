import type { PrdItem } from './prd'
import type { SiItem } from './systemInstruction'

export type RuntimeTarget = 'goclaw' | 'n8n' | 'claudecode' | 'markdown'

export interface ParsedAgentXml {
  agentName: string
  role: string
  context: string
  instructions: string
  criteria: string
  examples: string
  fullXml: string
}

export function extractAgentsFromSi(siMarkdown: string): ParsedAgentXml[] {
  if (!siMarkdown) return []

  const agents: ParsedAgentXml[] = []

  // Strategy 1: Find all ```xml ... ``` (or ``` ... ``` containing <role>) code blocks
  const xmlBlockRegex = /```(?:xml)?([\s\S]*?)```/gi
  let match: RegExpExecArray | null
  let blockIndex = 0

  while ((match = xmlBlockRegex.exec(siMarkdown)) !== null) {
    const xmlContent = match[1]?.trim() || ''
    if (!/<role>/i.test(xmlContent)) continue

    blockIndex++
    // Look backwards up to 400 chars before this ```xml block to find the nearest heading
    const beforeBlock = siMarkdown.slice(Math.max(0, match.index - 450), match.index)
    const linesBefore = beforeBlock.split('\n').map(l => l.trim()).filter(Boolean)

    let agentName = `Agent ${blockIndex}`
    // Search from bottom-most line upwards for a heading or numbered agent title
    for (let i = linesBefore.length - 1; i >= 0; i--) {
      const line = linesBefore[i]
      if (/^(?:#{1,4}\s*)?(?:\d+[\.\)\-:]\s*|Agent\s*\d*[\.\)\-:]?\s*)/i.test(line) || line.startsWith('#')) {
        const cleaned = line
          .replace(/^#{1,5}\s*/, '')
          .replace(/^\d+[\.\)\-:]\s*/, '')
          .replace(/[\*`_]/g, '')
          .trim()
        if (cleaned.length > 2 && !/^danh sách/i.test(cleaned) && !/^system instruction/i.test(cleaned)) {
          agentName = cleaned
          break
        }
      }
    }

    const role = (/<role>([\s\S]*?)<\/role>/i.exec(xmlContent)?.[1] || '').trim()
    const context = (/<context>([\s\S]*?)<\/context>/i.exec(xmlContent)?.[1] || '').trim()
    const instructions = (/<instructions>([\s\S]*?)<\/instructions>/i.exec(xmlContent)?.[1] || '').trim()
    const criteria = (/<criteria>([\s\S]*?)<\/criteria>/i.exec(xmlContent)?.[1] || '').trim()
    const examples = (/<examples>([\s\S]*?)<\/examples>/i.exec(xmlContent)?.[1] || '').trim()

    agents.push({
      agentName,
      role,
      context,
      instructions,
      criteria,
      examples,
      fullXml: xmlContent
    })
  }

  // Strategy 2: Fallback if <role> tags exist outside code fences
  if (agents.length === 0 && /<role>/i.test(siMarkdown)) {
    const roleMatches = [...siMarkdown.matchAll(/<role>([\s\S]*?)<\/role>/gi)]
    const contextMatches = [...siMarkdown.matchAll(/<context>([\s\S]*?)<\/context>/gi)]
    const instructionMatches = [...siMarkdown.matchAll(/<instructions>([\s\S]*?)<\/instructions>/gi)]
    const criteriaMatches = [...siMarkdown.matchAll(/<criteria>([\s\S]*?)<\/criteria>/gi)]
    const exampleMatches = [...siMarkdown.matchAll(/<examples>([\s\S]*?)<\/examples>/gi)]

    roleMatches.forEach((rm, idx) => {
      agents.push({
        agentName: `Agent ${idx + 1}`,
        role: (rm[1] || '').trim(),
        context: (contextMatches[idx]?.[1] || '').trim(),
        instructions: (instructionMatches[idx]?.[1] || '').trim(),
        criteria: (criteriaMatches[idx]?.[1] || '').trim(),
        examples: (exampleMatches[idx]?.[1] || '').trim(),
        fullXml: siMarkdown
      })
    })
  }

  return agents
}

export function extractJsonSchemaFromPrd(prdMarkdown: string, schemaType: 'input' | 'output'): string {
  if (!prdMarkdown) return '{\n  "type": "object",\n  "properties": {}\n}'

  const targetHeading = schemaType === 'input' ? /INPUT SCHEMA/i : /OUTPUT SCHEMA/i
  const headingMatch = targetHeading.exec(prdMarkdown)
  if (!headingMatch) return '{\n  "type": "object",\n  "properties": {}\n}'

  const substring = prdMarkdown.slice(headingMatch.index)
  const codeBlockMatch = /```(?:json)?([\s\S]*?)```/i.exec(substring)
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim())
      return JSON.stringify(parsed, null, 2)
    } catch {
      return codeBlockMatch[1].trim()
    }
  }

  return '{\n  "type": "object",\n  "properties": {}\n}'
}

// -------------------------------------------------------------
// 1. GOCLAW RUNTIME GENERATOR
// -------------------------------------------------------------
export interface GoClawPackage {
  agentCount: number
  agentNames: string[]
  agentsMd: string
  soulMd: string
  identityMd: string
  userMd: string
  userPredefinedMd: string
  capabilitiesMd: string
  heartbeatMd: string
  importJson: string
  readmeMd: string
  allInOne: string
}

export function generateGoClawPackage(
  prd: PrdItem | undefined,
  si: SiItem | undefined,
  specificAgentIndex?: number // 0-based index if exporting a single specific agent, undefined = combined multi-agent orchestrator
): GoClawPackage {
  const allAgents = extractAgentsFromSi(si?.markdown || '')
  const agents = typeof specificAgentIndex === 'number' && allAgents[specificAgentIndex]
    ? [allAgents[specificAgentIndex]]
    : allAgents
  const mainAgent = agents[0]
  const inputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'input')
  const outputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'output')
  const baseTitle = prd?.useCaseTitle || si?.useCaseTitle || 'AI Agent'
  const title = typeof specificAgentIndex === 'number' && mainAgent
    ? `${mainAgent.agentName} (${baseTitle})`
    : baseTitle

  // 1. AGENTS.md (Danh sách & Phân quyền toàn bộ Multi-Agent)
  const agentsMd = `# AGENTS.md - Danh Sách & Phân Quyền Multi-Agent (${agents.length || 1} Agents): ${title}

Hệ thống bao gồm **${agents.length || 1} Agent chuyên trách** phối hợp tuần tự theo kiến trúc Pipeline / Orchestrator:

${agents.length > 0 
  ? agents.map((ag, i) => `## Agent ${i + 1}: ${ag.agentName}
### Vai Trò & Định Vị (Role)
${ag.role || 'Xử lý tác vụ chuyên trách theo quy trình.'}

### Bối Cảnh & Đầu Vào (Context)
${ag.context || 'Tiếp nhận yêu cầu từ bước trước đó hoặc từ người dùng.'}

### Tiêu Chí Kiểm Soát & Ranh Giới (Criteria & Guardrails)
${ag.criteria || 'Tuân thủ schema và kiểm soát an toàn.'}
`).join('\n---\n\n')
  : `## Agent 1: Agent Điều Phối Chính\n- **Vai Trò:** Tự động hóa tác vụ ${title} theo chuẩn PRD.\n`}
`

  // 2. SOUL.md (Bản sắc cốt lõi, Tính cách & Ranh giới an toàn của TOÀN BỘ các Agent)
  const soulMd = `# SOUL.md - Bản Sắc Cốt Lõi & Ranh Giới An Toàn Hệ Thống Multi-Agent: ${title}

${agents.length > 1
  ? `Hệ thống vận hành dưới dạng **Tổ Hợp ${agents.length} AI Agent Chuyên Trách**, mỗi Agent giữ một vai trò và ranh giới thẩm quyền độc lập:\n\n` +
    agents.map((ag, i) => `## ${i + 1}. Bản Sắc & Guardrails - ${ag.agentName}
### Định Danh & Tính Cách:
${ag.role || 'AI Agent chuyên trách.'}

### Tiêu Chí An Toàn & Ranh Giới Thẩm Quyền:
${ag.criteria || '- Tuân thủ nghiêm ngặt JSON Schema.\n- Không tự bịa đặt dữ liệu.'}
`).join('\n---\n\n')
  : `${mainAgent?.role || 'Bạn là AI Agent tự hành của Striver AI.'}

## TIÊU CHÍ AN TOÀN & GUARDRAILS (RANH GIỚI BẢO MẬT)
${mainAgent?.criteria || '- Tuyệt đối không tự suy diễn số liệu khi chưa có dữ liệu đầu vào.\n- Bắt buộc tuân thủ đúng định dạng JSON Schema.\n- Nếu độ tin cậy thấp hoặc nghiệp vụ vượt thẩm quyền, dừng lại và yêu cầu con người phê duyệt.'}`
}
`

  // 3. IDENTITY.md (Định danh Hệ thống & Danh sách các Agent thành viên)
  const identityMd = `# IDENTITY.md - Định Danh Hệ Thống Multi-Agent

- **Tên Hệ Thống / Use-Case:** ${title}
- **Kiến Trúc Vận Hành:** Multi-Agent Pipeline (${agents.length || 1} Agents)
- **Danh Sách Agent Thành Viên:**
${agents.length > 0
  ? agents.map((ag, i) => `  ${i + 1}. **${ag.agentName}**`).join('\n')
  : `  1. **${title}**`}
- **Mô hình AI:** gemini-3.5-flash-lite (Primary) / gemini-3.5-flash
- **Phong cách:** Chuyên nghiệp, trực diện, chuẩn xác, phản hồi < 60s
- **Cấp độ tự chủ (Autonomy Tier):** L1 / L2 (Human-in-the-loop qua Telegram/Webhook)
`

  // 4. USER.md (Định nghĩa ngữ cảnh người dùng / khách hàng mục tiêu)
  const userMd = `# USER.md - Ngữ Cảnh Người Dùng (Theo Người Dùng)

- **Đối tượng tương tác:** Khách hàng, đối tác hoặc nhân sự nội bộ cần xử lý nghiệp vụ: ${title}
- **Kênh tiếp nhận:** Webhook, Zalo OA, Telegram, Website Form
- **Ngôn ngữ ưu tiên:** Tiếng Việt (chuẩn mực, ngắn gọn, xúc tích)
- **Cơ chế ghi nhớ:** Giữ phiên hội thoại theo session_id hoặc user_id.
`

  // 5. USER_PREDEFINED.md (Bối cảnh nghiệp vụ, Input Schema & KPI)
  const userPredefinedMd = `# USER_PREDEFINED.md - Bối Cảnh Nghiệp Vụ & Dữ Liệu Mục Tiêu

## 1. MỤC TIÊU NGHIỆP VỤ
Tự động hóa hoàn toàn use-case: **${title}** (với sự phối hợp của ${agents.length || 1} Agent: ${agents.map(a => a.agentName).join(' ➔ ') || title})

## 2. KÊNH TIẾP NHẬN & DỮ LIỆU ĐẦU VÀO
- Kênh tương tác: Webhook API, Zalo OA, Telegram, Website Form
- **Input JSON Schema Chuẩn:**
\`\`\`json
${inputSchema}
\`\`\`

## 3. CHỈ SỐ CAM KẾT (SLA / KPI)
- Thời gian phản hồi: Dưới 60 giây
- Độ chính xác trích xuất: >= 95%
- Cơ chế leo thang: Chuyển nhân sự khi khách khiếu nại hoặc dữ liệu thiếu
`

  // 6. CAPABILITIES.md (Năng lực, Quy trình thực thi chi tiết từng Agent & Output Schema)
  const capabilitiesMd = `# CAPABILITIES.md - Năng Lực, Quy Trình Phối Hợp ${agents.length || 1} Agent & Schema Đầu Ra

## 1. QUY TRÌNH THỰC THI CHI TIẾT CỦA TỪNG AGENT (MULTI-AGENT WORKFLOW)
${agents.length > 0
  ? agents.map((ag, i) => `## Giai Đoạn ${i + 1}: ${ag.agentName}

### A. Bối Cảnh & Input Của ${ag.agentName}:
${ag.context || 'Nhận dữ liệu từ bước trước.'}

### B. Các Bước Thực Thi (Instructions):
${ag.instructions || 'Quy trình thực thi theo tiêu chuẩn.'}

### C. Tiêu Chí Nghiệm Thu (Criteria):
${ag.criteria || 'Đảm bảo đầu ra đúng định dạng.'}

### D. Ví Dụ Mẫu (Few-shot Examples):
${ag.examples || 'Tham khảo tài liệu PRD.'}
`).join('\n\n======================================================================\n\n')
  : `${mainAgent?.instructions || '1. Tiếp nhận payload từ webhook hoặc trigger.\n2. Bóc tách dữ liệu theo Input Schema.\n3. Xử lý tác vụ nghiệp vụ.\n4. Trả về kết quả theo Output Schema.'}

### Ví Dụ Mẫu (Few-shot):
${mainAgent?.examples || 'Tham khảo tài liệu PRD.'}
`}

## 2. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC CUỐI CÙNG (FINAL OUTPUT JSON SCHEMA)
\`\`\`json
${outputSchema}
\`\`\`
`

  // 7. HEARTBEAT.md (Kiểm tra định kỳ & xử lý tồn đọng)
  const heartbeatMd = `# HEARTBEAT.md - Tác Vụ Định Kỳ & Kiểm Soát Ngoại Lệ

## 1. CHU KỲ KIỂM TRA (HEARTBEAT CRON)
- Tần suất: Mỗi 5 phút (*/5 * * * *)

## 2. CHECKLIST KIỂM TRA ĐỊNH KỲ:
- [ ] Quét các yêu cầu hoặc lead tồn đọng chưa được xử lý > 10 phút.
- [ ] Kiểm tra các tác vụ đang chờ con người phê duyệt (Human-in-the-loop).
- [ ] Báo cáo tóm tắt trạng thái về kênh Telegram định kỳ.
- [ ] Tự động chuyển tiếp cảnh báo khẩn cấp nếu gặp lỗi API hoặc Timeout.
`

  // 8. IMPORT JSON (Gói đóng gói 1-click cho nút "Import Agent" trên GoClaw)
  const importJson = JSON.stringify({
    name: title,
    slug: `goclaw-${(title || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    version: "1.0.0",
    model: "gemini-3.5-flash-lite",
    provider: "google-ai-studio",
    autonomy: {
      tier: "L1",
      requireHumanApproval: true,
      approvalChannel: "telegram"
    },
    files: {
      "AGENTS.md": agentsMd,
      "SOUL.md": soulMd,
      "IDENTITY.md": identityMd,
      "USER.md": userMd,
      "USER_PREDEFINED.md": userPredefinedMd,
      "CAPABILITIES.md": capabilitiesMd,
      "HEARTBEAT.md": heartbeatMd
    }
  }, null, 2)

  const readmeMd = `# GoClaw Autonomous Agent: ${title}

Được tự động sinh từ **Striver AI Enterprise Engine**.

## Cấu trúc thư mục tương thích 100% với GoClaw:
\`\`\`
agent/
├── AGENTS.md            # Danh sách Agent và phân quyền trách nhiệm
├── SOUL.md              # Định danh, tính cách, giới hạn thẩm quyền
├── IDENTITY.md          # Tên Agent, model và phong cách
├── USER.md              # Ngữ cảnh người dùng (theo người dùng)
├── USER_PREDEFINED.md   # Bối cảnh nghiệp vụ và Input Schema
├── CAPABILITIES.md      # Quy trình thực thi & Output JSON Schema
├── HEARTBEAT.md         # Checklist tác vụ chạy định kỳ
└── goclaw-import.json   # File nhập 1-click vào GoClaw
\`\`\`
`

  const allInOne = `==================== AGENTS.md ====================
${agentsMd}

==================== SOUL.md ====================
${soulMd}

==================== IDENTITY.md ====================
${identityMd}

==================== USER.md ====================
${userMd}

==================== USER_PREDEFINED.md ====================
${userPredefinedMd}

==================== CAPABILITIES.md ====================
${capabilitiesMd}

==================== HEARTBEAT.md ====================
${heartbeatMd}
`

  return {
    agentCount: allAgents.length,
    agentNames: allAgents.map(a => a.agentName),
    agentsMd,
    soulMd,
    identityMd,
    userMd,
    userPredefinedMd,
    capabilitiesMd,
    heartbeatMd,
    importJson,
    readmeMd,
    allInOne
  }
}

// -------------------------------------------------------------
// 2. N8N WORKFLOW GENERATOR (Valid importable JSON)
// -------------------------------------------------------------
export function generateN8nWorkflow(prd: PrdItem | undefined, si: SiItem | undefined): string {
  const agents = extractAgentsFromSi(si?.markdown || '')
  const mainAgent = agents[0]
  const title = prd?.useCaseTitle || si?.useCaseTitle || 'Striver AI Agent'
  const outputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'output')

  const systemMessage = agents.length > 0
    ? agents.map((ag, i) => `=== AGENT ${i + 1}: ${ag.agentName} ===\n[ROLE]\n${ag.role}\n\n[INSTRUCTIONS]\n${ag.instructions}\n\n[CRITERIA]\n${ag.criteria}`).join('\n\n----------------------------------------\n\n')
    : 'Bạn là AI Agent tự hành.'

  const workflow = {
    name: `Striver AI - ${title.slice(0, 40)}`,
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "striver-agent-trigger",
          responseMode: "lastNode",
          options: {}
        },
        id: "node-webhook-1",
        name: "Webhook Nhận Yêu Cầu",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300]
      },
      {
        parameters: {
          promptType: "define",
          text: "={{ $json.body }}",
          options: {
            systemMessage: systemMessage
          }
        },
        id: "node-ai-agent-2",
        name: "AI Agent Xử Lý",
        type: "@n8n/n8n-nodes-langchain.agent",
        typeVersion: 1.7,
        position: [500, 300]
      },
      {
        parameters: {
          modelName: "models/gemini-2.0-flash",
          model: "models/gemini-2.0-flash",
          options: {
            temperature: 0.3
          }
        },
        id: "node-gemini-model-3",
        name: "Google Gemini Model",
        type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
        typeVersion: 1,
        position: [500, 520]
      },
      {
        parameters: {
          schemaType: "manual",
          inputSchema: outputSchema
        },
        id: "node-structured-output-4",
        name: "Định Dạng JSON Output",
        type: "@n8n/n8n-nodes-langchain.outputParserStructured",
        typeVersion: 1.3,
        position: [680, 520]
      },
      {
        parameters: {
          chatId: "={{ $env.TELEGRAM_CHAT_ID }}",
          text: `🔔 [Striver AI] Agent đã xử lý xong tác vụ: ${title}\nKết quả: {{ JSON.stringify($json.output) }}`,
          additionalFields: {}
        },
        id: "node-telegram-approval-5",
        name: "Bắn Thông Báo / Duyệt Telegram (HITL)",
        type: "n8n-nodes-base.telegram",
        typeVersion: 1.2,
        position: [800, 300]
      }
    ],
    connections: {
      "Webhook Nhận Yêu Cầu": {
        main: [
          [
            {
              node: "AI Agent Xử Lý",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Google Gemini Model": {
        ai_languageModel: [
          [
            {
              node: "AI Agent Xử Lý",
              type: "ai_languageModel",
              index: 0
            }
          ]
        ]
      },
      "Định Dạng JSON Output": {
        ai_outputParser: [
          [
            {
              node: "AI Agent Xử Lý",
              type: "ai_outputParser",
              index: 0
            }
          ]
        ]
      },
      "AI Agent Xử Lý": {
        main: [
          [
            {
              node: "Bắn Thông Báo / Duyệt Telegram (HITL)",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    },
    active: false,
    settings: {
      executionOrder: "v1"
    }
  }

  return JSON.stringify(workflow, null, 2)
}

// -------------------------------------------------------------
// 3. CLAUDE CODE / CODEX / CURSOR GENERATOR
// -------------------------------------------------------------
export interface ClaudeCodePackage {
  cliCommand: string
  cursorRules: string
  fullPrompt: string
}

export function generateClaudeCodePackage(prd: PrdItem | undefined, si: SiItem | undefined): ClaudeCodePackage {
  const title = prd?.useCaseTitle || si?.useCaseTitle || 'AI Agent'
  const agents = extractAgentsFromSi(si?.markdown || '')
  const mainAgent = agents[0]

  const cliCommand = `claude "Đọc đặc tả PRD và System Instruction bên dưới, sau đó xây dựng một backend API FastAPI/Express hoàn chỉnh gồm Webhook tiếp nhận, gọi LLM Gemini 3.5, validate Output JSON Schema và gửi thông báo Telegram phê duyệt Human-in-the-loop cho use-case: ${title}"`

  const cursorRules = `# .cursorrules / .claudecode for ${title}

## ROLE & BEHAVIOR
${mainAgent?.role || 'Bạn là AI Agent tự hành.'}

## CORE INSTRUCTIONS
${mainAgent?.instructions || 'Thực thi tuần tự các bước, trả về JSON Schema chuẩn.'}

## CODING STANDARDS FOR THIS AGENT
- Ngôn ngữ: TypeScript (Node.js) hoặc Python (FastAPI).
- Bắt buộc kiểm tra runtime validation cho đầu ra bằng Zod / Pydantic.
- Cấu hình chốt chặn Human-in-the-loop (Telegram Webhook) trước khi gửi kết quả ra ngoài.
- Tích hợp Retry with Exponential Backoff khi gọi Google Gemini API.
`

  const fullPrompt = `# LỆNH KHỞI TẠO HỆ THỐNG AGENT (CLAUDE CODE / CODEX / CURSOR)

${cliCommand}

---
### NGUYÊN TẮC HỆ THỐNG (SYSTEM INSTRUCTION)
${si?.markdown || ''}

---
### ĐẶC TẢ KIẾN TRÚC PRD
${prd?.markdown || ''}
`

  return { cliCommand, cursorRules, fullPrompt }
}
