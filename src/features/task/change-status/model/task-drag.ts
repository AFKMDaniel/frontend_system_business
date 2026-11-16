import type { StatusTask } from '@/entities/task'

export type TaskDragData = {
  taskId: number
  status: StatusTask
  executorUserId: number | null
}

export type TaskCloseRequest = {
  teamId: number
  taskId: number
  undo: () => void
}
