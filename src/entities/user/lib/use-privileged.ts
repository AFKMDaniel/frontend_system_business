import { TEAM_ROLES } from '@/entities/team/types'

import { useIsAdmin } from './use-is-admin'
import { useTeamRole } from './use-team-role'

export function usePrivileged(teamId: number | string): boolean {
  const isAdmin = useIsAdmin()
  const teamRole = useTeamRole(teamId)
  return isAdmin || teamRole === TEAM_ROLES.manager
}
