import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import type { StageConfig } from '../model/stage'

export const stageApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getStageConfig: builder.query<StageConfig, number>({
      query: (teamId) => API_ENDPOINTS.teams.stageConfig(teamId),
      providesTags: ['Stage'],
    }),
  }),
})
