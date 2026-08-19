import type { EntityState } from '@reduxjs/toolkit'

import { rootApi } from '@/app/providers/root-api'
import type { RootState } from '@/app/providers/store'
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
      async onQueryStarted({ teamId, taskId, body }, { dispatch, getState, queryFulfilled }) {
        const nextStatus = body.status
        if (nextStatus == null) return

        const cacheEntries = taskApi.util.selectInvalidatedBy(getState() as RootState, [
          { type: 'Task' },
        ])
        const patches = cacheEntries
          .filter((entry) => entry.originalArgs.teamId === teamId)
          .map(({ endpointName, originalArgs }) => {
            if (endpointName === 'getTasks') {
              return dispatch(
                taskApi.util.updateQueryData(
                  'getTasks',
                  originalArgs as { teamId: number; params?: TaskListParams },
                  (draft) => {
                    const task = draft.entities[taskId]
                    if (task) task.status = nextStatus
                  },
                ),
              )
            }
            if (endpointName === 'getTaskById' && originalArgs.taskId === taskId) {
              return dispatch(
                taskApi.util.updateQueryData(
                  'getTaskById',
                  originalArgs as { teamId: number; taskId: number },
                  (draft) => {
                    draft.status = nextStatus
                  },
                ),
              )
            }
            return null
          })

        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch?.undo())
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
