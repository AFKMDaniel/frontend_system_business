import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState } from '@/app/providers/store'
import { API_ENDPOINTS, API_URL } from '@/shared/config'
import { fetchWithAuth } from '@/shared/api/fetch-with-auth'
import { parseResponseError, type ApiError } from '@/shared/api/error'

import type { OutCreateUserScheme } from './types'

export const login = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: ApiError }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.auth.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })
  if (!response.ok) return rejectWithValue(await parseResponseError(response))
  return (await response.json()) as string
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
    return (await response.json()) as string
  },
)

export const logout = createAsyncThunk<void, void, { state: RootState; rejectValue: ApiError }>(
  'auth/logout',
  async (_arg, { getState, rejectWithValue }) => {
    const response = await fetchWithAuth(`${API_URL}${API_ENDPOINTS.auth.logout}`, { method: 'POST' }, getState)
    if (!response.ok) return rejectWithValue(await parseResponseError(response))
  },
)
