import { ListTodo, Loader2 } from 'lucide-react'

import { ExecutorInfo } from '@/entities/team'
import { STATUS_LABEL_KEYS, TASK_STATUSES, TaskCard } from '@/entities/task'
import { useTranslation } from '@/shared/i18n'
import { Badge } from '@/shared/ui/badge'

import type { StatusTask, TaskSchema } from '@/entities/task'

type TaskBoardBodyProps = {
  isFetching: boolean
  isError: boolean
  tasksByStatus: Record<StatusTask, TaskSchema[]> | null
  teamId: number
}

export function TaskBoardBody({ isFetching, isError, tasksByStatus, teamId }: TaskBoardBodyProps) {
  const { t } = useTranslation()

  if (isFetching) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }
  if (isError) {
    return <p className="text-destructive text-sm">{t('task.board.loadError')}</p>
  }
  if (!tasksByStatus || TASK_STATUSES.every((status) => tasksByStatus[status].length === 0)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <ListTodo className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium">{t('task.board.none')}</p>
          <p className="text-muted-foreground mt-1 text-xs">{t('task.board.adjustFilters')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {TASK_STATUSES.map((status) => {
        const tasks = tasksByStatus[status]
        return (
          <section key={status} className="bg-card flex flex-col gap-3 rounded-lg border p-3">
            <header className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">{t(STATUS_LABEL_KEYS[status])}</h2>
              <Badge variant="secondary">{tasks.length}</Badge>
            </header>
            <div className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <div className="rounded-md border border-dashed px-3 py-8 text-center">
                  <p className="text-muted-foreground text-xs">{t('task.board.none')}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    executor={(userId) => <ExecutorInfo teamId={teamId} userId={userId} />}
                  />
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
