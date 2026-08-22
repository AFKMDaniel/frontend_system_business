import type { StatusTask } from './status'

export type TaskDragAccess = {
  isPrivileged: boolean
  isExecutor: boolean
}

export type TaskDragData = {
  status: StatusTask
  executorUserId: number | null
}

export function getAllowedStatuses(
  data: TaskDragData,
  access: TaskDragAccess,
): StatusTask[] {
  if (access.isPrivileged) {
    switch (data.status) {
      case 'open':
        return data.executorUserId != null ? ['work', 'closed'] : ['closed']
      case 'work':
        return ['open', 'closed']
      case 'review':
        return ['work', 'closed']
      case 'closed':
        return ['open', 'work']
    }
  }

  if (access.isExecutor) {
    switch (data.status) {
      case 'open':
        return ['work']
      case 'work':
        return ['open', 'review']
      case 'review':
        return ['work']
      case 'closed':
        return []
    }
  }

  return []
}
