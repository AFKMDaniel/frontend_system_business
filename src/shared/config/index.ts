export const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export const TASK_STATUSES = ['open', 'work', 'closed'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TEAM_ROLES = ['owner', 'manager', 'employee'] as const
export type TeamRole = (typeof TEAM_ROLES)[number]
