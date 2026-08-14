export type AccessToken = string

export interface AuthTokenResponse {
  access_token: string
  token_type: string
  message?: string
}

export interface RoleSchema {
  name: string
}

export interface TeamSchema {
  id: number
  name: string
}

export interface CurrentTeamSchema {
  id: number
  name: string
  role: string | null
}

export interface TeamMemberSchema {
  team: TeamSchema
  role: string | null
}

export interface LoginUserScheme {
  id: number
  email: string
  roles: RoleSchema[]
  current_team: CurrentTeamSchema | null
  teams: TeamMemberSchema[]
}

export interface OutCreateUserScheme {
  id: number
  email: string
  roles: RoleSchema[]
}

export interface UpdateUserScheme {
  email?: string | null
  password?: string | null
}
