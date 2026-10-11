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
  // Matches each agent section: e.g. "### 1. Agent ..." or "1. Agent ..." followed by ```xml ... ```
  const agentBlockRegex = /(?:###?\s*)?(\d+[\.\)]\s*(?:Agent[^\n\r]+|\*\*[^\*]+\*\*|[^\n\r]+))[\s\S]*?```xml([\s\S]*?)```/gi
  let match: RegExpExecArray | null

  while ((match = agentBlockRegex.exec(siMarkdown)) !== null) {
    const rawTitle = match[1]?.replace(/[#\*]/g, '').trim() || 'Agent'
    const xmlContent = match[2]?.trim() || ''

    const role = (/<role>([\s\S]*?)<\/role>/i.exec(xmlContent)?.[1] || '').trim()
    const context = (/<context>([\s\S]*?)<\/context>/i.exec(xmlContent)?.[1] || '').trim()
    const instructions = (/<instructions>([\s\S]*?)<\/instructions>/i.exec(xmlContent)?.[1] || '').trim()
    const criteria = (/<criteria>([\s\S]*?)<\/criteria>/i.exec(xmlContent)?.[1] || '').trim()
    const examples = (/<examples>([\s\S]*?)<\/examples>/i.exec(xmlContent)?.[1] || '').trim()

    agents.push({
      agentName: rawTitle,
      role,
      context,
      instructions,
      criteria,
      examples,
      fullXml: xmlContent
    })
  }

  // Fallback if regex didn't catch separate headers
  if (agents.length === 0 && siMarkdown.includes('<role>')) {
    const role = (/<role>([\s\S]*?)<\/role>/i.exec(siMarkdown)?.[1] || '').trim()
    const context = (/<context>([\s\S]*?)<\/context>/i.exec(siMarkdown)?.[1] || '').trim()
    const instructions = (/<instructions>([\s\S]*?)<\/instructions>/i.exec(siMarkdown)?.[1] || '').trim()
    const criteria = (/<criteria>([\s\S]*?)<\/criteria>/i.exec(siMarkdown)?.[1] || '').trim()
    const examples = (/<examples>([\s\S]*?)<\/examples>/i.exec(siMarkdown)?.[1] || '').trim()
    agents.push({
      agentName: 'Agent Chính',
      role,
      context,
      instructions,
      criteria,
      examples,
      fullXml: siMarkdown
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
  soulMd: string
  instructionsMd: string
  agentsMd: string
  toolsJson: string
  configYaml: string
  readmeMd: string
  allInOne: string
}

export function generateGoClawPackage(prd: PrdItem | undefined, si: SiItem | undefined): GoClawPackage {
  const agents = extractAgentsFromSi(si?.markdown || '')
  const mainAgent = agents[0]
  const inputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'input')
  const outputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'output')
  const title = prd?.useCaseTitle || si?.useCaseTitle || 'AI Agent'

  const soulMd = `# SOUL.md - ${mainAgent?.agentName || title}
${mainAgent?.role || 'Bạn là AI Agent tự hành của Striver AI.'}

## GUARDRAILS & TIÊU CHÍ AN TOÀN
${mainAgent?.criteria || '- Luôn kiểm tra định dạng dữ liệu đầu vào.\n- Bắt buộc tuân thủ Output JSON Schema.'}
`

  const agentsMd = `# AGENTS.md - Danh Sách Agents & Phân Quyền (${title})

${agents.length > 0 
  ? agents.map((ag, i) => `### ${i + 1}. ${ag.agentName}
**Vai Trò:** ${ag.role || 'Xử lý tác vụ chuyên trách.'}
**Nguyên Tắc / Tiêu Chí:** ${ag.criteria || 'Tuân thủ schema và giới hạn quyền.'}
`).join('\n\n')
  : `### 1. Agent Điều Phối Chính\n**Vai Trò:** Tự động hóa tác vụ theo PRD.\n`}
`

  const instructionsMd = agents.length > 1
    ? `# INSTRUCTIONS.md - ${title}

${agents.map((ag, i) => `## PHẦN ${i + 1}: ${ag.agentName}
### 1. Quy Trình Thực Thi
${ag.instructions || 'Tiếp nhận payload, xử lý và xuất JSON Schema.'}

### 2. Ví Dụ Mẫu (Few-shot Examples)
${ag.examples || 'Tham khảo tài liệu PRD.'}
`).join('\n\n---\n\n')}`
    : `# INSTRUCTIONS.md - ${mainAgent?.agentName || title}

## QUY TRÌNH THỰC THI (STEP-BY-STEP)
${mainAgent?.instructions || '1. Tiếp nhận payload từ webhook hoặc trigger.\n2. Bóc tách dữ liệu theo Input Schema.\n3. Xử lý tác vụ nghiệp vụ.\n4. Trả về kết quả theo Output Schema.'}

## VÍ DỤ THỰC TẾ (FEW-SHOT EXAMPLES)
${mainAgent?.examples || 'Xem thêm trong đặc tả kỹ thuật PRD.'}
`

  let parsedInputSchema = {}
  try { parsedInputSchema = JSON.parse(inputSchema) } catch {}
  let parsedOutputSchema = {}
  try { parsedOutputSchema = JSON.parse(outputSchema) } catch {}

  const toolsJson = JSON.stringify({
    tools: [
      {
        name: "execute_agent_task",
        description: `Thực thi nhiệm vụ cốt lõi cho ${title}`,
        parameters: parsedInputSchema,
        output_schema: parsedOutputSchema
      }
    ]
  }, null, 2)

  const configYaml = `name: "${title.replace(/["\n\r]/g, '')}"
version: "1.0.0"
runtime: "goclaw-v1"
model: "gemini-3.5-flash"
fallback_model: "gemini-3.5-flash-lite"
temperature: 0.35
max_tokens: 16000

autonomy:
  tier: "L1" # L0: Read-Only | L1: Draft with Human Approval | L2: Guardrailed Auto | L3: Full Auto
  require_human_approval: true
  approval_channel: "telegram" # telegram, slack, webhook

storage:
  type: "memory"
  vector_store: "chroma"
  embedding_model: "text-embedding-004"
`

  const readmeMd = `# GoClaw Autonomous Agent: ${title}

Được tự động sinh từ **Striver AI Enterprise Engine**.

## Cấu trúc thư mục:
\`\`\`
agent/
├── SOUL.md           # Định danh, tính cách, giới hạn thẩm quyền
├── AGENTS.md         # Danh mục Agent và phân quyền trách nhiệm
├── INSTRUCTIONS.md   # Quy trình thực thi tuần tự & xử lý ngoại lệ
├── tools.json        # Định nghĩa Input/Output Tool Schemas
└── config.yaml       # Cấu hình Autonomy Tier (L1/L2) & Model Gemini 3.5
\`\`\`

## Cách chạy ngay với GoClaw CLI:
\`\`\`bash
# 1. Cài đặt GoClaw (nếu chưa có)
curl -fsSL https://get.goclaw.sh | bash

# 2. Khởi chạy Agent trong workspace
goclaw run --workspace .
\`\`\`
`

  const allInOne = `==================== SOUL.md ====================
${soulMd}

==================== AGENTS.md ====================
${agentsMd}

==================== INSTRUCTIONS.md ====================
${instructionsMd}

==================== tools.json ====================
${toolsJson}

==================== config.yaml ====================
${configYaml}
`

  return { soulMd, instructionsMd, agentsMd, toolsJson, configYaml, readmeMd, allInOne }
}

// -------------------------------------------------------------
// 2. N8N WORKFLOW GENERATOR (Valid importable JSON)
// -------------------------------------------------------------
export function generateN8nWorkflow(prd: PrdItem | undefined, si: SiItem | undefined): string {
  const agents = extractAgentsFromSi(si?.markdown || '')
  const mainAgent = agents[0]
  const title = prd?.useCaseTitle || si?.useCaseTitle || 'Striver AI Agent'
  const outputSchema = extractJsonSchemaFromPrd(prd?.markdown || '', 'output')

  const systemMessage = `${mainAgent?.role || ''}\n\n${mainAgent?.instructions || ''}`.trim() || 'Bạn là AI Agent tự hành.'

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
