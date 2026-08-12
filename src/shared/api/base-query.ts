import {
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { API_ENDPOINTS, API_URL } from '@/shared/config'
import { refreshToken } from './auth-thunks'
import type { RootState } from '@/app/providers/store'

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

async function refreshTokens(dispatch: BaseQueryApi['dispatch']): Promise<boolean> {
  try {
    await dispatch(refreshToken()).unwrap()
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
  const url = typeof args === 'string' ? args : args.url
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && url !== API_ENDPOINTS.auth.refresh) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens(api.dispatch).finally(() => {
        refreshPromise = null
      })
    }

    const refreshed = await refreshPromise
    if (refreshed) {
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
