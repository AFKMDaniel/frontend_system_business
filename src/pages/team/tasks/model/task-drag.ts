export type TaskDragData = {
  taskId: number
  stageId: number
  executorUserId: number | null
}

export type TaskCloseRequest = {
  teamId: number
  taskId: number
  stageId: number
  undo: () => void
}
