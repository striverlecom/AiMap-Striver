export const DEFAULT_GEMINI_API_KEY = 'AQ.Ab8RN6J5Aq60Q4oUHLXsraxTmnYvOYHScP3r73OtJMOH9Fry1w'

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey())
}
