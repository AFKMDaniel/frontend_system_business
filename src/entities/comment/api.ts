import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import type { CommentCreateSchema, CommentSchema } from './types'

export const commentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<CommentSchema[], { teamId: number; taskId: number }>({
      query: ({ teamId, taskId }) => API_ENDPOINTS.comments.list(teamId, taskId),
      providesTags: ['Comment'],
    }),
    addComment: builder.mutation<
      CommentSchema,
      { teamId: number; taskId: number; body: CommentCreateSchema }
    >({
      query: ({ teamId, taskId, body }) => ({
        url: API_ENDPOINTS.comments.list(teamId, taskId),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: builder.mutation<
      CommentSchema,
      { teamId: number; taskId: number; commentId: number; body: CommentCreateSchema }
    >({
      query: ({ teamId, taskId, commentId, body }) => ({
        url: API_ENDPOINTS.comments.item(teamId, taskId, commentId),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation<void, { teamId: number; taskId: number; commentId: number }>({
      query: ({ teamId, taskId, commentId }) => ({
        url: API_ENDPOINTS.comments.item(teamId, taskId, commentId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
})
