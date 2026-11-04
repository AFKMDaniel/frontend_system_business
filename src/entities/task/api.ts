import type { EntityState } from '@reduxjs/toolkit'

import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import { taskAdapter } from './lib/task-adapter'

import type {
  OutAVGGradeTaskSchema,
  TaskCreateSchema,
  TaskListParams,
  TaskSchema,
  UpdateTaskSchema,
  UpdateTaskStatusSchema,
} from './types'

export const taskApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      EntityState<TaskSchema, number>,
      { teamId: number; params?: TaskListParams }
    >({
      query: ({ teamId, params }) => ({
        url: API_ENDPOINTS.teams.tasks(teamId),
        params,
      }),
      transformResponse: (response: TaskSchema[]) =>
        taskAdapter.setAll(taskAdapter.getInitialState(), response),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.teamId,
      forceRefetch: ({ currentArg, previousArg }) =>
        JSON.stringify(currentArg) !== JSON.stringify(previousArg),
      providesTags: ['Task'],
    }),
    getTaskById: builder.query<TaskSchema, { teamId: number; taskId: number }>({
      query: ({ teamId, taskId }) => API_ENDPOINTS.teams.task(teamId, taskId),
      providesTags: ['Task'],
    }),
    getAvgTaskGrade: builder.query<
      OutAVGGradeTaskSchema,
      { teamId: number; params?: { user_id?: number; start_date?: string; end_date?: string } }
    >({
      query: ({ teamId, params }) => ({
        url: API_ENDPOINTS.teams.taskAvgGrade(teamId),
        params,
      }),
      providesTags: [{ type: 'Task', id: 'avg-grade' }],
    }),
    createTask: builder.mutation<TaskSchema, { teamId: number; body: TaskCreateSchema }>({
      query: ({ teamId, body }) => ({
        url: API_ENDPOINTS.teams.taskCreate(teamId),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<
      TaskSchema,
      { teamId: number; taskId: number; body: UpdateTaskSchema }
    >({
      query: ({ teamId, taskId, body }) => ({
        url: API_ENDPOINTS.teams.taskUpdate(teamId, taskId),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation<
      TaskSchema,
      { teamId: number; taskId: number; body: UpdateTaskStatusSchema }
    >({
      query: ({ teamId, taskId, body }) => ({
        url: API_ENDPOINTS.teams.taskUpdateStatus(teamId, taskId),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Task'],
      async onQueryStarted({ teamId, taskId, body }, { dispatch, queryFulfilled }) {
        if (!body.status) return

        const patch = dispatch(
          taskApi.util.updateQueryData('getTasks', { teamId }, (draft) => {
            const task = draft.entities[taskId]
            if (task) task.status = body.status!
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patch?.undo()
        }
      },
    }),
    deleteTask: builder.mutation<void, { teamId: number; taskId: number }>({
      query: ({ teamId, taskId }) => ({
        url: API_ENDPOINTS.teams.taskDelete(teamId, taskId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
})
