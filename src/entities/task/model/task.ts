import type { StageSchema } from './stage'

export type GradeTask = 1 | 2 | 3 | 4 | 5

export interface ExecutorSchema {
  id: number
  email: string
}

export interface TaskSchema {
  id: number
  team_id: number
  executor_user_id: number | null
  executor?: ExecutorSchema | null
  title: string
  description: string
  stage: StageSchema
  deadline: string
  grade: GradeTask | null
  close_date: string | null
}

export interface TaskCreateSchema {
  executor_user_id?: number | null
  title: string
  description: string
  deadline: string
}

export interface UpdateTaskSchema {
  title?: string
  description?: string | null
  deadline?: string | null
}

export interface UpdateTaskExecutorSchema {
  executor_user_id?: number | null
}

export interface UpdateTaskStageSchema {
  stage_id: number
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
