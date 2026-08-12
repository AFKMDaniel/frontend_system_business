export type TeamRole = 'employee' | 'manager'

export interface TeamUserShortSchema {
  id: number
  email: string
}

export interface TeamMemberResponseSchema {
  id: number
  role: string
  user: TeamUserShortSchema
}

export interface TeamResponseSchema {
  id: number
  name: string
  members: TeamMemberResponseSchema[]
}

export interface AddTeamMemberSchema {
  user_id: number
  role?: TeamRole
}

export interface UpdateTeamMemberRoleSchema {
  role: TeamRole
}

export interface AdminTeamCreateSchema {
  name: string
  invite_code: string
}

export interface OutAdminTeamCreateSchema {
  id: number
  name: string
  invite_code: string
}
