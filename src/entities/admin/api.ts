import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import type { AdminPanelParams, AdminScheme } from './types'

export const adminApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPanel: builder.query<AdminScheme, AdminPanelParams | undefined>({
      query: (params) => ({ url: API_ENDPOINTS.admin.panel, params }),
    }),
  }),
})
