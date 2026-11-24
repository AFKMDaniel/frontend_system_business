import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import type { TaskSchema } from '../model/task'

export const taskAdapter = createEntityAdapter<TaskSchema>({
  sortComparer: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
})

export const { selectAll: selectAllTasks, selectById: selectTaskById } = taskAdapter.getSelectors()

export const selectTasksByStage = createSelector(
  selectAllTasks,
  (tasks): Record<number, TaskSchema[]> =>
    tasks.reduce<Record<number, TaskSchema[]>>((map, task) => {
      const bucket = (map[task.stage.id] ??= [])
      bucket.push(task)
      return map
    }, {}),
)
