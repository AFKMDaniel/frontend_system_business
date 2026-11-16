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
  const allowed: StatusTask[] = []

  if (access.isPrivileged) {
    switch (data.status) {
      case 'open':
        allowed.push(...(data.executorUserId != null ? (['work', 'closed'] as const) : (['closed'] as const)))
        break
      case 'work':
        allowed.push('open', 'closed')
        break
      case 'review':
        allowed.push('work', 'closed')
        break
      case 'closed':
        allowed.push('open', 'work')
        break
    }
  }

  if (access.isExecutor) {
    switch (data.status) {
      case 'open':
        allowed.push('work')
        break
      case 'work':
        allowed.push('open', 'review')
        break
      case 'review':
        allowed.push('work')
        break
      case 'closed':
        break
    }
  }

  return [...new Set(allowed)]
}
