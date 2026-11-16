// Dialog contract declared globally so the shared dialog slice can type
// `openDialog` payloads without importing feature slices. Feature prop types
// are resolved here, in the app layer (which may import features).
import type { FunctionComponent } from 'react'

import type { GradeTaskDialogProps } from '@/features/task/grade-task'
import type { JoinTeamDialogProps } from '@/features/team/join-team'
import type { RichTextLinkDialogProps } from '@/shared/ui/rich-text-link-dialog'

declare global {
  type DialogPropsMap = {
    'join-team': JoinTeamDialogProps
    'grade-task': GradeTaskDialogProps
    'rich-text-link': RichTextLinkDialogProps
  }

  type DialogId = keyof DialogPropsMap

  type DialogPayload = {
    [K in DialogId]: { id: K; props?: DialogPropsMap[K]; onClose?: () => void }
  }[DialogId]

  type DialogRegistry = {
    [K in DialogId]: FunctionComponent<DialogPropsMap[K]>
  }
}

export {}
