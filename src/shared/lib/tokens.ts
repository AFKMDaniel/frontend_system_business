export const TOKEN_STORAGE_KEY = 'frontend-system-business.tokens'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

export function getStoredTokens(): StoredTokens | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredTokens
  } catch {
    return null
  }
}

export function setStoredTokens(tokens: StoredTokens) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
