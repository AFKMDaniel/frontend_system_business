import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './base-query'

export const TAG_TYPES = ['User', 'Team', 'Task', 'Meeting', 'Comment'] as const

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
})
