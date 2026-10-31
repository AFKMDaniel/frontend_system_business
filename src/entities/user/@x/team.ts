// TODO: part of the team <-> user @x cycle — `team` imports this file, while
// `user` imports `@/entities/team/@x/user`. Break it by moving
// TEAM_ROLES/TeamRole out of entities/team, then reassess what belongs here.
export { getRoleLabel } from '../lib/get-role-label'

export type { TeamMemberSchema } from '../types'
