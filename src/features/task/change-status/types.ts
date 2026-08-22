import type { StatusTask } from '@/entities/task'

export type TaskDragData = {
  taskId: number
  status: StatusTask
  executorUserId: number | null
}
