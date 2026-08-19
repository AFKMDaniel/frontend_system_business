export const TASK_STATUSES = ['open', 'work', 'review', 'closed'] as const

export type StatusTask = (typeof TASK_STATUSES)[number]

export const STATUS_LABEL_KEYS = {
  open: 'task.status.open',
  work: 'task.status.work',
  review: 'task.status.review',
  closed: 'task.status.closed',
} as const satisfies Record<StatusTask, string>
