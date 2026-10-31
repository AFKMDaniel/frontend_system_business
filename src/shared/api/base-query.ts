import {
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS, API_URL } from '@/shared/config'

import { normalizeApiError, type ApiError } from './error'

type RefreshTokenThunk = () => { unwrap: () => Promise<unknown> }

type ReauthExtra = {
  refreshToken?: RefreshTokenThunk
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(api: BaseQueryApi): Promise<boolean> {
  const extra = api.extra as ReauthExtra
  if (!extra.refreshToken) return false

  try {
    await api.dispatch(extra.refreshToken()).unwrap()
    return true
  } catch {
    return false
  }
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url
  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    const error = normalizeApiError(result.error)

    if (
      (error.kind === 'http' || error.kind === 'validation') &&
      error.status === 401 &&
      url !== API_ENDPOINTS.auth.refresh
    ) {
      if (!refreshPromise) {
        refreshPromise = refreshTokens(api).finally(() => {
          refreshPromise = null
        })
      }

      const refreshed = await refreshPromise
      if (refreshed) {
        const retry = await baseQuery(args, api, extraOptions)
        if (retry.error) return { error: normalizeApiError(retry.error) }
        return retry
      }
    }

    return { error }
  }

  return result
}
