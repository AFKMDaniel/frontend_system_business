import type { TeamRole } from '@/entities/team/types'
import { TEAM_ROLES } from '@/entities/team/types'

import { userApi } from '../api'

export function useTeamRole(teamId: number | string): TeamRole | null {
  const { data: user } = userApi.useGetUserMeQuery()
  const role = user?.teams.find((membership) => membership.team.id === Number(teamId))?.role ?? null

  if (role !== TEAM_ROLES.manager && role !== TEAM_ROLES.employee) {
    return null
  }

  return role
}
