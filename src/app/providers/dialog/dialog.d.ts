// Dialog contract declared globally so the shared dialog slice can type
// `openDialog` payloads without importing feature slices. Feature prop types
// are resolved here, in the app layer (which may import features).
import type { FunctionComponent } from 'react'

import type { GradeTaskDialogProps } from '@/features/task/grade-task'
import type { JoinTeamDialogProps } from '@/features/team/join-team'

declare global {
  type DialogPropsMap = {
    'join-team': JoinTeamDialogProps
    'grade-task': GradeTaskDialogProps
  }

  type DialogId = keyof DialogPropsMap

  type DialogPayload = {
    [K in DialogId]: { id: K; props?: DialogPropsMap[K] }
  }[DialogId]

  type DialogRegistry = {
    [K in DialogId]: FunctionComponent<DialogPropsMap[K]>
  }
}

export {}
