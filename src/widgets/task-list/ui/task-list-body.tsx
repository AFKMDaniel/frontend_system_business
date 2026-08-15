import { format } from 'date-fns'
import { ListTodo, Loader2 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'

import type { StatusTask, TaskSchema } from '@/entities/task'

type StatusMeta = {
  label: string
  badgeVariant: 'default' | 'secondary' | 'outline'
  badgeClassName: string
  accentClassName: string
}

const STATUS_META: Record<StatusTask, StatusMeta> = {
  open: {
    label: 'Open',
    badgeVariant: 'secondary',
    badgeClassName: '',
    accentClassName: 'border-l-muted-foreground/25',
  },
  work: {
    label: 'In progress',
    badgeVariant: 'default',
    badgeClassName: '',
    accentClassName: 'border-l-primary',
  },
  closed: {
    label: 'Closed',
    badgeVariant: 'outline',
    badgeClassName:
      'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
    accentClassName: 'border-l-emerald-500',
  },
}

function formatTaskDate(value: string): string {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return format(date, 'MMM d, yyyy')
}

export type TaskListItem = {
  task: TaskSchema
  executor: string
}

type TaskListBodyProps = {
  isLoading: boolean
  isError: boolean
  filtered: TaskListItem[]
}

export function TaskListBody({ isLoading, isError, filtered }: TaskListBodyProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }
  if (isError) {
    return <p className="text-destructive text-sm">Failed to load tasks.</p>
  }
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <ListTodo className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium">No tasks</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Try adjusting the filters.
          </p>
        </div>
      </div>
    )
  }
  return (
    <ul className="bg-card divide-y overflow-hidden rounded-lg border">
      {filtered.map(({ task, executor }) => {
        const meta = STATUS_META[task.status]
        return (
          <li
            key={task.id}
            className={cn('flex items-center gap-4 border-l-4 py-3 pr-4 pl-3', meta.accentClassName)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={meta.badgeVariant}
                  className={meta.badgeClassName || undefined}
                >
                  {meta.label}
                </Badge>
                {task.grade != null ? (
                  <Badge variant="outline">Grade {task.grade}/5</Badge>
                ) : null}
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm">{task.description}</p>
              <p className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
                <span className="truncate">
                  {task.executor_user_id != null ? executor : 'Unassigned'}
                </span>
                <span aria-hidden="true">•</span>
                <span>Due {formatTaskDate(task.deadline)}</span>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
