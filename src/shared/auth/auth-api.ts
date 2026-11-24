import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      query: () => ({ url: API_ENDPOINTS.auth.logout, method: 'POST' }),
    }),
  }),
})

export const { useLogoutMutation } = authApi
