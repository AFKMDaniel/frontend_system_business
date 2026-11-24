import { ListTodo, Loader2 } from 'lucide-react'

import { sortStagesByPosition } from '@/entities/task'
import type { StageConfig, StageSchema, TaskSchema } from '@/entities/task'
import { ExecutorInfo } from '@/entities/team'
import { DraggableTaskCard, DropStageColumn, TaskStageDndProvider } from '@/features/task/change-stage'
import type { TaskCloseRequest } from '@/features/task/change-stage'
import { useTranslation } from '@/shared/i18n'

type TaskBoardBodyProps = {
  isLoading: boolean
  isError: boolean
  config: StageConfig | undefined
  tasksByStage: Record<number, TaskSchema[]> | null
  teamId: number
  onTaskCloseRequest: (request: TaskCloseRequest) => void
}

export function TaskBoardBody({
  isLoading,
  isError,
  config,
  tasksByStage,
  teamId,
  onTaskCloseRequest,
}: TaskBoardBodyProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }
  if (isError || !config) {
    return <p className="text-destructive text-sm">{t('task.board.loadError')}</p>
  }

  const stages: StageSchema[] = sortStagesByPosition(config.stages)

  if (
    !tasksByStage ||
    stages.every((stage) => (tasksByStage[stage.id] ?? []).length === 0)
  ) {
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
    <TaskStageDndProvider teamId={teamId} config={config} onTaskCloseRequest={onTaskCloseRequest}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4">
        {stages.map((stage) => {
          const tasks = tasksByStage?.[stage.id] ?? []
          return (
            <DropStageColumn
              key={stage.id}
              stage={stage}
              count={tasks.length}
              teamId={teamId}
              config={config}
            >
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
                    config={config}
                    executor={(userId) => <ExecutorInfo teamId={teamId} userId={userId} />}
                  />
                ))
              )}
            </DropStageColumn>
          )
        })}
      </div>
    </TaskStageDndProvider>
  )
}
