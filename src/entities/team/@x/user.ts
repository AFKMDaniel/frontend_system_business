// TODO: break the team <-> user @x cycle. `team` imports
// `@/entities/user/@x/team`, while `user` imports this file. Move
// TEAM_ROLES/TeamRole to shared (or a standalone entity) and drop this @x file.
export { TEAM_ROLES } from '../types'
export type { TeamRole } from '../types'
