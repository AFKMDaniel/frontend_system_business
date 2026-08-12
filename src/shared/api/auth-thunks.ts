import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState } from '@/app/providers/store'
import { API_ENDPOINTS, API_URL } from '@/shared/config'
import { fetchWithAuth } from './fetch-with-auth'

export const login = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.auth.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })
  if (!response.ok) return rejectWithValue(`Login failed (${response.status})`)
  return (await response.json()) as string
})

export const refreshToken = createAsyncThunk<string, void, { rejectValue: string }>(
  'auth/refreshToken',
  async (_arg, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.auth.refresh}`, { method: 'POST' })
    if (!response.ok) return rejectWithValue(`Token refresh failed (${response.status})`)
    return (await response.json()) as string
  },
)

export const logout = createAsyncThunk<void, void, { state: RootState; rejectValue: string }>(
  'auth/logout',
  async (_arg, { getState, rejectWithValue }) => {
    const response = await fetchWithAuth(`${API_URL}${API_ENDPOINTS.auth.logout}`, { method: 'POST' }, getState)
    if (!response.ok) return rejectWithValue(`Logout failed (${response.status})`)
  },
)
