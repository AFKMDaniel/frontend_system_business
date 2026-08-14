import { rootApi } from '@/app/providers/root-api'
import { API_ENDPOINTS } from '@/shared/config'

import type { LoginUserScheme, UpdateUserScheme } from './types'

export const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMe: builder.query<LoginUserScheme, void>({
      query: () => API_ENDPOINTS.users.me,
      providesTags: ['User'],
    }),
    updateUserMe: builder.mutation<LoginUserScheme, UpdateUserScheme>({
      query: (body) => ({ url: API_ENDPOINTS.users.me, method: 'PATCH', body }),
      invalidatesTags: ['User'],
    }),
    deleteUserMe: builder.mutation<void, void>({
      query: () => ({ url: API_ENDPOINTS.users.me, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    joinTeam: builder.mutation<void, { inviteCode: string }>({
      query: ({ inviteCode }) => ({
        url: API_ENDPOINTS.users.joinTeam,
        method: 'POST',
        params: { invite_code: inviteCode },
      }),
      invalidatesTags: ['Team'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: API_ENDPOINTS.auth.logout, method: 'POST' }),
    }),
  }),
})
