import fs from 'node:fs'
import path from 'node:path'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('Missing OPENAI_API_KEY')
  process.exit(1)
}

const defaultPath = path.join(process.env.USERPROFILE || process.env.HOME || '.', 'Downloads', '04-architect-ozil-knowledge-pack.md')
const knowledgePath = process.env.KNOWLEDGE_PACK_PATH || defaultPath

if (!fs.existsSync(knowledgePath)) {
  console.error(`Knowledge pack not found: ${knowledgePath}`)
  process.exit(1)
}

const openai = new OpenAI({ apiKey })
const vectorStore = await openai.vectorStores.create({
  name: 'striver-prd-knowledge-pack'
})

const file = await openai.files.create({
  file: fs.createReadStream(knowledgePath),
  purpose: 'assistants'
})

await openai.vectorStores.files.create(vectorStore.id, {
  file_id: file.id
})

console.log(`OPENAI_PRD_VECTOR_STORE_ID=${vectorStore.id}`)
console.log(`OPENAI_PRD_KNOWLEDGE_FILE_ID=${file.id}`)

