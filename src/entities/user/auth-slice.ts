import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/app/providers/store'
import { userApi } from './api'
import { login, refreshToken } from './auth-thunks'

type AuthStatus = 'idle' | 'refreshing' | 'ready'

type AuthState = {
  token: string | null
  status: AuthStatus
}

const initialState: AuthState = {
  token: null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload
        state.status = 'ready'
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = 'refreshing'
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.token = payload
        state.status = 'ready'
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null
        state.status = 'ready'
      })
      .addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
        state.token = null
      })
  },
})

export default authSlice.reducer

export const selectAccessToken = (state: RootState) => state.auth.token

export const selectAuthStatus = (state: RootState) => state.auth.status

export const selectAuthReady = (state: RootState) => state.auth.status === 'ready'
