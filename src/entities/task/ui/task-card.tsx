import type { ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { formatDate } from '@/shared/i18n/lib/format-date'
import { useTranslation } from '@/shared/i18n'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

import { STATUS_LABEL_KEYS } from '../lib/status'

import type { TaskSchema } from '../types'
import type { StatusTask } from '../lib/status'

type StatusMeta = {
  badgeVariant: 'default' | 'secondary' | 'outline'
  badgeClassName: string
  accentClassName: string
}

const STATUS_META: Record<StatusTask, StatusMeta> = {
  open: {
    badgeVariant: 'secondary',
    badgeClassName: '',
    accentClassName: 'border-l-muted-foreground/25',
  },
  work: {
    badgeVariant: 'default',
    badgeClassName: '',
    accentClassName: 'border-l-primary',
  },
  review: {
    badgeVariant: 'outline',
    badgeClassName: 'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400',
    accentClassName: 'border-l-blue-500',
  },
  closed: {
    badgeVariant: 'outline',
    badgeClassName:
      'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
    accentClassName: 'border-l-emerald-500',
  },
}

type TaskCardProps = {
  task: TaskSchema
  executor: (userId: number | null) => ReactNode
}

export function TaskCard({ task, executor }: TaskCardProps) {
  const meta = STATUS_META[task.status]
  const { t } = useTranslation()

  return (
    <Card className={cn('border-l-4', meta.accentClassName)}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={meta.badgeVariant} className={meta.badgeClassName || undefined}>
            {t(STATUS_LABEL_KEYS[task.status])}
          </Badge>
          {/*  TODO: make grade shared component with stars */}
          {task.grade != null ? (
            <Badge variant="outline">
              {t('task.grade')} {task.grade}/5
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="line-clamp-2 text-sm">{task.description}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>
              {t('task.due')} {formatDate(new Date(task.deadline), 'd MMM yyyy')}
            </span>
          </span>
          {executor(task.executor_user_id)}
        </div>
      </CardContent>
    </Card>
  )
}
