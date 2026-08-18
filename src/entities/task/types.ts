import type { StatusTask } from './lib/status'

export type GradeTask = 1 | 2 | 3 | 4 | 5

export interface TaskSchema {
  id: number
  team_id: number
  executor_user_id: number | null
  description: string
  status: StatusTask
  deadline: string
  grade: GradeTask | null
  close_date: string | null
}

export interface TaskCreateSchema {
  executor_user_id?: number | null
  description: string
  deadline: string
}

export interface UpdateTaskSchema {
  executor_user_id?: number | null
  description?: string | null
  deadline?: string | null
}

export interface UpdateTaskStatusSchema {
  status?: StatusTask | null
  grade?: GradeTask | null
}

export interface OutAVGGradeTaskSchema {
  grade: number
}

export interface TaskListParams {
  only_my?: boolean
  executor_user_id?: number
  start_date?: string
  end_date?: string
}
