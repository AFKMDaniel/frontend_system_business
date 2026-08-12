export interface CommentSchema {
  id: number
  task_id: number
  user_id: number
  text: string
  created_at: string
}

export interface CommentCreateSchema {
  text: string
}
