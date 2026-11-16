import type { RoleSchema, TeamMemberSchema } from '@/entities/user/@x/admin'

export interface AdminScheme {
  id: number
  email: string
  roles: RoleSchema[]
  team_memberships: TeamMemberSchema[]
}

export interface AdminPanelParams {
  team_id?: number
  task_id?: number
  user_id?: number
  comment_id?: number
  meeting_id?: number
}
