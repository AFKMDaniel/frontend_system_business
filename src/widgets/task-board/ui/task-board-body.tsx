import { ListTodo, Loader2 } from 'lucide-react'

import { ExecutorInfo } from '@/entities/team'
import { TASK_STATUSES } from '@/entities/task'
import { DraggableTaskCard, DropStatusColumn, TaskStatusDndProvider } from '@/features/task/change-status'
import { useTranslation } from '@/shared/i18n'

import type { StatusTask, TaskSchema } from '@/entities/task'

type TaskBoardBodyProps = {
  isLoading: boolean
  isError: boolean
  tasksByStatus: Record<StatusTask, TaskSchema[]> | null
  teamId: number
}

export function TaskBoardBody({ isLoading, isError, tasksByStatus, teamId }: TaskBoardBodyProps) {
  const { t } = useTranslation()

  if (isLoading) {
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
    <TaskStatusDndProvider teamId={teamId}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_STATUSES.map((status) => {
          const tasks = tasksByStatus[status]
          return (
            <DropStatusColumn key={status} status={status} count={tasks.length} teamId={teamId}>
              {tasks.length === 0 ? (
                <div className="rounded-md border border-dashed px-3 py-8 text-center">
                  <p className="text-muted-foreground text-xs">{t('task.board.none')}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    teamId={teamId}
                    task={task}
                    executor={(userId) => <ExecutorInfo teamId={teamId} userId={userId} />}
                  />
                ))
              )}
            </DropStatusColumn>
          )
        })}
      </div>
    </TaskStatusDndProvider>
  )
}
