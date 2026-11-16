export const TEAM_ROLES = {
  employee: 'employee',
  manager: 'manager',
} as const

export type TeamRole = (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES]
