export const TASK_STATUSES = ['open', 'work', 'review', 'closed'] as const

export type StatusTask = (typeof TASK_STATUSES)[number]

export const STATUS_LABELS: Record<StatusTask, string> = {
  open: 'Open',
  work: 'In progress',
  review: 'In review',
  closed: 'Closed',
}
