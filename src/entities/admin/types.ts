import type { CurrentTeamSchema, RoleSchema, TeamMemberSchema } from '@/entities/user/types'

export interface AdminScheme {
  id: number
  email: string
  roles: RoleSchema[]
  current_team: CurrentTeamSchema | null
  team_memberships: TeamMemberSchema[]
}

export interface AdminPanelParams {
  team_id?: number
  task_id?: number
  user_id?: number
  comment_id?: number
  meeting_id?: number
}
