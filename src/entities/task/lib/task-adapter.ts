import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import type { TaskSchema } from '../types'
import type { StatusTask } from './status'

export const taskAdapter = createEntityAdapter<TaskSchema>({
  sortComparer: (a, b) =>
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
})

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
} = taskAdapter.getSelectors()

export const selectTasksByStatus = createSelector(
  selectAllTasks,
  (tasks): Record<StatusTask, TaskSchema[]> =>
    tasks.reduce<Record<StatusTask, TaskSchema[]>>(
      (map, task) => {
        map[task.status].push(task)
        return map
      },
      {
        open: [],
        work: [],
        review: [],
        closed: [],
      },
    ),
)
