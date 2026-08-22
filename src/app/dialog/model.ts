import { JoinTeamDialog } from '@/features/team/join-team'
import { GradeTaskDialog } from '@/features/task/grade-task'

import { DIALOG_IDS, type DialogRegistry } from './types'

export const dialogRegistry: DialogRegistry = {
  [DIALOG_IDS.joinTeam]: JoinTeamDialog,
  [DIALOG_IDS.gradeTask]: GradeTaskDialog,
}
