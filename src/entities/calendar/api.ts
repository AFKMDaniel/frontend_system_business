import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import type { CalendarDaySchema, CalendarParams } from './types'

export const calendarApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendar: builder.query<CalendarDaySchema[], CalendarParams | undefined>({
      query: (params) => ({ url: API_ENDPOINTS.calendar, params }),
      providesTags: ['Calendar'],
    }),
  }),
})
