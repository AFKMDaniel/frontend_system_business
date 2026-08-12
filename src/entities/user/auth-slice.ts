import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/app/providers/store'
import { login, logout, refreshToken } from '@/shared/api/auth-thunks'

type AuthState = {
  token: string | null
}

const initialState: AuthState = {
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.token = payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null
      })
  },
})

export default authSlice.reducer

export const selectAccessToken = (state: RootState) => state.auth.token
