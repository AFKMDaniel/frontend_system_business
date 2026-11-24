export const APP_ROLES = {
  admin: 'admin',
  user: 'user',
} as const

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES]

export interface RoleSchema {
  name: string
}

export interface TeamSchema {
  id: number
  name: string
}

export interface TeamMemberSchema {
  team: TeamSchema
  role: string | null
}

export interface LoginUserScheme {
  id: number
  email: string
  roles: RoleSchema[]
  teams: TeamMemberSchema[]
}

export interface UpdateUserScheme {
  email?: string | null
  password?: string | null
}
