import type { ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { generatePath, Link } from 'react-router-dom'

import type { StageType } from '../model/stage'
import { cn } from '@/shared/lib/utils'
import { formatDate, useTranslation } from '@/shared/i18n'
import { ROUTES } from '@/shared/config'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Rating } from '@/shared/ui/rating'

import type { TaskSchema } from '../model/task'

type StageMeta = {
  badgeVariant: 'default' | 'secondary' | 'outline'
  badgeClassName: string
  accentClassName: string
}

const STAGE_TYPE_META: Record<StageType, StageMeta> = {
  OPEN: {
    badgeVariant: 'secondary',
    badgeClassName: '',
    accentClassName: 'border-l-muted-foreground/25',
  },
  MIDDLE: {
    badgeVariant: 'default',
    badgeClassName: '',
    accentClassName: 'border-l-primary',
  },
  END: {
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
  const meta = STAGE_TYPE_META[task.stage.type]
  const { t } = useTranslation()

  return (
    <Card className={cn('border-l-4', meta.accentClassName)}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={meta.badgeVariant} className={meta.badgeClassName || undefined}>
            {task.stage.name}
          </Badge>
          {task.grade != null ? (
            <div className="flex items-center gap-1.5">
              <Rating rate={task.grade} />
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link
          to={generatePath(ROUTES.teamTask, {
            teamId: String(task.team_id),
            taskId: String(task.id),
          })}
          className="hover:underline"
        >
          <p className="line-clamp-2 text-sm">{task.title}</p>
        </Link>
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
