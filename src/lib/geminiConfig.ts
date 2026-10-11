export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || ''
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}
