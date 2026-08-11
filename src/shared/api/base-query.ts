import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/shared/config'
import { clearStoredTokens, getStoredTokens, setStoredTokens } from '@/shared/lib/tokens'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const tokens = getStoredTokens()
    if (tokens) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    }
    return headers
  },
})

let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  const tokens = getStoredTokens()
  if (!tokens?.refreshToken) return false

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })
    if (!response.ok) return false

    const data = (await response.json()) as {
      accessToken: string
      refreshToken: string
    }
    setStoredTokens(data)
    return true
  } catch {
    return false
  }
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null
      })
    }

    const refreshed = await refreshPromise
    if (refreshed) {
      result = await baseQuery(args, api, extraOptions)
    } else {
      clearStoredTokens()
    }
  }

  return result
}
