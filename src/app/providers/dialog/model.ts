import { JoinTeamDialog } from '@/features/team/join-team'
import { GradeTaskDialog } from '@/features/task/grade-task'
import { RichTextLinkDialog } from '@/shared/ui/rich-text-link-dialog'

export const dialogRegistry: DialogRegistry = {
  'join-team': JoinTeamDialog,
  'grade-task': GradeTaskDialog,
  'rich-text-link': RichTextLinkDialog,
}
