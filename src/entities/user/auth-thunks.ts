import { createAsyncThunk } from '@reduxjs/toolkit'

import { rootApi } from '@/app/providers/root-api'
import { API_ENDPOINTS, API_URL } from '@/shared/config'
import { parseResponseError, type ApiError } from '@/shared/api/error'

import type { AuthTokenResponse, OutCreateUserScheme } from './types'

export const login = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: ApiError }
>('auth/login', async ({ username, password }, { rejectWithValue, dispatch }) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.auth.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })
  if (!response.ok) return rejectWithValue(await parseResponseError(response))
  const payload = (await response.json()) as AuthTokenResponse
  dispatch(rootApi.util.resetApiState())
  return payload.access_token
})

export const register = createAsyncThunk<
  OutCreateUserScheme,
  { email: string; password: string },
  { rejectValue: ApiError }
>('auth/register', async ({ email, password }, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.users.register}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) return rejectWithValue(await parseResponseError(response))
  return (await response.json()) as OutCreateUserScheme
})

export const refreshToken = createAsyncThunk<string, void, { rejectValue: ApiError }>(
  'auth/refreshToken',
  async (_arg, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.auth.refresh}`, { method: 'POST' })
    if (!response.ok) return rejectWithValue(await parseResponseError(response))
    const payload = (await response.json()) as AuthTokenResponse
    return payload.access_token
  },
)
