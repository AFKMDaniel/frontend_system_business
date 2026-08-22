import type { FunctionComponent } from 'react'

import type { JoinTeamDialogProps } from '@/features/team/join-team'
import type { GradeTaskDialogProps } from '@/features/task/grade-task'

export const DIALOG_IDS = {
  joinTeam: 'join-team',
  gradeTask: 'grade-task',
} as const

export type DialogId = (typeof DIALOG_IDS)[keyof typeof DIALOG_IDS]

export type DialogPropsMap = {
  [DIALOG_IDS.joinTeam]: JoinTeamDialogProps
  [DIALOG_IDS.gradeTask]: GradeTaskDialogProps
}

export type DialogPayload = {
  [K in DialogId]: { id: K; props?: DialogPropsMap[K] }
}[DialogId]

export type DialogRegistry = {
  [K in DialogId]: FunctionComponent<DialogPropsMap[K]>
}
