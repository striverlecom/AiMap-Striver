import { PrismaClient } from '@prisma/client'
import {
  extractAgentsFromSi,
  extractJsonSchemaFromPrd,
  generateGoClawPackage,
  generateN8nWorkflow,
  generateClaudeCodePackage
} from '../src/lib/agentRuntimes.ts'

const prisma = new PrismaClient()

async function testRuntimes() {
  console.log('=== BẮT ĐẦU KIỂM TRA TOÀN DIỆN 3 CHẾ ĐỘ RUNTIME ===\n')

  // 1. Kiểm tra dữ liệu thực từ database
  const usersWithDay9 = await prisma.user.findMany({
    where: {
      day9Data: { isNot: null }
    },
    include: {
      day8Data: true,
      day9Data: true
    }
  })

  console.log(`Tìm thấy ${usersWithDay9.length} user có dữ liệu Ngày 9 trong DB.`)

  let prdSample = null
  let siSample = null

  for (const u of usersWithDay9) {
    try {
      const prds = JSON.parse(u.day8Data?.prdData || '[]')
      const sis = JSON.parse(u.day9Data?.siData || '[]')
      const completedPrd = prds.find(p => p.status === 'completed' && p.markdown)
      const completedSi = sis.find(s => s.status === 'completed' && s.markdown)
      if (completedPrd && completedSi) {
        prdSample = completedPrd
        siSample = completedSi
        console.log(`-> Đã lấy mẫu thực tế từ user ${u.email}: Use-case "${completedPrd.useCaseTitle}"`)
        break
      }
    } catch (e) {
      console.warn('Lỗi parse mẫu:', e.message)
    }
  }

  // Nếu DB chưa có cặp completed, dùng mẫu production chuẩn của Striver AI
  if (!prdSample || !siSample) {
    console.log('-> Dùng mẫu benchmark chuẩn Striver AI (Báo giá & Phân loại Lead tự động):')
    prdSample = {
      useCaseIndex: 1,
      useCaseTitle: 'Tự Động Phân Loại Lead & Báo Giá',
      markdown: `# PRD: Tự Động Phân Loại Lead & Báo Giá

## 1. MỤC TIÊU & PHẠM VI
Tự động hóa tiếp nhận khách hàng, trích xuất nhu cầu, tính toán chi phí và phản hồi báo giá.

## 2. KIẾN TRÚC AGENT
- Agent Tiếp Nhận & Phân Loại: Đọc tin nhắn, trích xuất ngân sách và thời hạn.
- Agent Báo Giá: Tính toán đơn giá theo bảng biểu và tạo bản thảo báo giá.

## 3. INPUT SCHEMA
\`\`\`json
{
  "type": "object",
  "properties": {
    "customer_name": { "type": "string" },
    "channel": { "type": "string", "enum": ["zalo", "facebook", "website"] },
    "inquiry_text": { "type": "string" },
    "budget_range": { "type": "string" }
  },
  "required": ["customer_name", "channel", "inquiry_text"]
}
\`\`\`

## 4. OUTPUT SCHEMA
\`\`\`json
{
  "type": "object",
  "properties": {
    "lead_score": { "type": "number", "minimum": 0, "maximum": 100 },
    "category": { "type": "string", "enum": ["hot", "warm", "cold"] },
    "quote_amount": { "type": "number" },
    "quote_details": { "type": "string" },
    "requires_human_approval": { "type": "boolean" }
  },
  "required": ["lead_score", "category", "requires_human_approval"]
}
\`\`\`
`
    }

    siSample = {
      useCaseIndex: 1,
      useCaseTitle: 'Tự Động Phân Loại Lead & Báo Giá',
      markdown: `# System Instructions: Tự Động Phân Loại Lead & Báo Giá

Danh sách Agent:
1. Agent Phân Loại Khách Hàng
2. Agent Soạn Báo Giá

### 1. Agent Phân Loại Khách Hàng
\`\`\`xml
<role>
Bạn là Trợ lý AI cao cấp chuyên phân loại và đánh giá tiềm năng khách hàng doanh nghiệp B2B.
</role>
<context>
Khách hàng liên hệ qua các kênh Zalo OA, Website Form hoặc Fanpage. Cần xử lý phản hồi dưới 60 giây.
</context>
<instructions>
1. Đọc nội dung yêu cầu của khách hàng.
2. Trích xuất thông tin: quy mô doanh nghiệp, nhu cầu chính, ngân sách dự kiến.
3. Chấm điểm lead_score từ 0 đến 100 theo tiêu chuẩn BANT.
4. Gán category: hot (>=70), warm (40-69), cold (<40).
</instructions>
<criteria>
- Tuyệt đối không tự suy diễn số điện thoại nếu khách chưa cung cấp.
- Nếu lead_score >= 80, bắt buộc đặt requires_human_approval = true để nhân viên kinh doanh duyệt trước.
</criteria>
<examples>
Khách: "Chào bạn, mình cần làm hệ thống AI quản lý kho 500m2, ngân sách tầm 50tr"
Output: lead_score = 85, category = "hot", requires_human_approval = true.
</examples>
\`\`\`

### 2. Agent Soạn Báo Giá
\`\`\`xml
<role>
Bạn là Chuyên viên Lập Dự Toán & Báo Giá Doanh Nghiệp.
</role>
<context>
Tính toán chi phí dựa trên khung giá cố định và các tính năng bổ sung.
</context>
<instructions>
1. Tiếp nhận kết quả phân loại từ Agent 1.
2. Áp dụng bảng giá theo từng module.
3. Tạo nội dung báo giá chuyên nghiệp bằng tiếng Việt.
</instructions>
<criteria>
- Luôn kèm điều khoản thanh toán 50/50.
- Giá phải bao gồm VAT 8%.
</criteria>
<examples>
Nội dung báo giá gồm 3 gói: Starter, Pro, Enterprise.
</examples>
\`\`\`
`
    }
  }

  console.log('\n--- BƯỚC 1: KIỂM TRA CHẾ ĐỘ 1 - GOCLAW.SH / OPENCLAW ---')
  const goclawPkg = generateGoClawPackage(prdSample, siSample)
  console.log('✓ SOUL.md độ dài:', goclawPkg.soulMd.length, 'ký tự')
  console.log('✓ INSTRUCTIONS.md độ dài:', goclawPkg.instructionsMd.length, 'ký tự')
  console.log('✓ config.yaml độ dài:', goclawPkg.configYaml.length, 'ký tự')
  console.log('✓ tools.json độ dài:', goclawPkg.toolsJson.length, 'ký tự')

  // Kiểm tra tính hợp lệ của tools.json
  try {
    const parsedTools = JSON.parse(goclawPkg.toolsJson)
    if (!Array.isArray(parsedTools.tools) || parsedTools.tools.length === 0) {
      throw new Error('tools.json thiếu mảng tools')
    }
    console.log('✓ tools.json PARSE THÀNH CÔNG! Số tool:', parsedTools.tools.length)
    console.log('  Tool name:', parsedTools.tools[0].name)
    console.log('  Parameters properties:', Object.keys(parsedTools.tools[0].parameters?.properties || {}))
  } catch (e) {
    console.error('❌ LỖI tools.json:', e.message)
    process.exit(1)
  }

  console.log('\n--- BƯỚC 2: KIỂM TRA CHẾ ĐỘ 2 - N8N WORKFLOW (IMPORTABLE JSON) ---')
  const n8nWorkflowStr = generateN8nWorkflow(prdSample, siSample)
  try {
    const n8nJson = JSON.parse(n8nWorkflowStr)
    console.log('✓ n8n workflow PARSE THÀNH CÔNG!')
    console.log('  Tên workflow:', n8nJson.name)
    console.log('  Số node:', n8nJson.nodes.length)
    console.log('  Danh sách node:')
    n8nJson.nodes.forEach((node, i) => {
      console.log(`    ${i + 1}. [${node.type}] -> "${node.name}"`)
    })
    console.log('  Kiểm tra kết nối (connections):', Object.keys(n8nJson.connections))

    // Kiểm tra cấu hình Structured Output Parser
    const parserNode = n8nJson.nodes.find(n => n.type.includes('outputParserStructured'))
    if (!parserNode) throw new Error('Thiếu node outputParserStructured')
    const parsedSchema = JSON.parse(parserNode.parameters.inputSchema)
    console.log('✓ Output Schema trong n8n hợp lệ! Schema type:', parsedSchema.type, '| Properties:', Object.keys(parsedSchema.properties || {}))
  } catch (e) {
    console.error('❌ LỖI n8n workflow JSON:', e.message)
    process.exit(1)
  }

  console.log('\n--- BƯỚC 3: KIỂM TRA CHẾ ĐỘ 3 - CLAUDE CODE / CODEX / CURSOR ---')
  const claudePkg = generateClaudeCodePackage(prdSample, siSample)
  console.log('✓ CLI Command:', claudePkg.cliCommand.slice(0, 100) + '...')
  console.log('✓ .cursorrules độ dài:', claudePkg.cursorRules.length, 'ký tự')
  console.log('✓ Full Blueprint Prompt độ dài:', claudePkg.fullPrompt.length, 'ký tự')

  console.log('\n🎉 TẤT CẢ 3 CHẾ ĐỘ ĐÃ VƯỢT QUA KIỂM THỬ THỰC TẾ!')
}

testRuntimes()
  .catch(err => {
    console.error('Lỗi kiểm thử:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
