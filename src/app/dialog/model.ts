import { JoinTeamDialog } from '@/features/team/join-team'

import { DIALOG_IDS, type DialogRegistry } from './types'

export const dialogRegistry: DialogRegistry = {
  [DIALOG_IDS.joinTeam]: JoinTeamDialog,
}
