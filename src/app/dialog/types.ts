import type { FunctionComponent } from 'react'

import type { JoinTeamDialogProps } from '@/features/team/join-team'

export const DIALOG_IDS = {
  joinTeam: 'join-team',
} as const

export type DialogId = (typeof DIALOG_IDS)[keyof typeof DIALOG_IDS]

export type DialogPropsMap = {
  [DIALOG_IDS.joinTeam]: JoinTeamDialogProps
}

export type DialogPayload = {
  [K in DialogId]: { id: K; props?: DialogPropsMap[K] }
}[DialogId]

export type DialogRegistry = {
  [K in DialogId]: FunctionComponent<DialogPropsMap[K]>
}
