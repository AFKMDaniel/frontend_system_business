import type { TFunction } from 'i18next'

import { APP_ROLES } from '../types'
import { TEAM_ROLES } from '@/entities/team/types'

export const ALL_ROLES = { ...APP_ROLES, ...TEAM_ROLES } as const

export type Role = (typeof ALL_ROLES)[keyof typeof ALL_ROLES]

const ROLE_LABEL_KEYS = {
  admin: 'roles.admin',
  user: 'roles.user',
  manager: 'roles.manager',
  employee: 'roles.employee',
} as const satisfies Record<Role, string>

export function getRoleLabel(t: TFunction, role: string): string {
  const key = ROLE_LABEL_KEYS[role as Role]
  return key ? t(key) : role
}
