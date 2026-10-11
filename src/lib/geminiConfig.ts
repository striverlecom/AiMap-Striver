export const DEFAULT_GEMINI_API_KEY = 'REDACTED_GEMINI_KEY'

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey())
}
