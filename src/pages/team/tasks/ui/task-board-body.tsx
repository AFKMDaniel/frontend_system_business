import { Loader2 } from 'lucide-react'

import { sortStagesByPosition } from '@/entities/task'
import type { StageConfig, StageSchema, TaskSchema } from '@/entities/task'
import { ExecutorInfo } from '@/entities/team'
import { useTranslation } from '@/shared/i18n'
import { ScrollArea } from '@/shared/ui/scroll-area'

import type { TaskCloseRequest } from '../model/task-drag'
import { DraggableTaskCard } from './draggable-task-card'
import { DropStageColumn } from './drop-stage-column'
import { TaskStageDndProvider } from './task-stage-dnd-provider'

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
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }
  if (isError || !config) {
    return <p className="text-destructive text-sm">{t('task.board.loadError')}</p>
  }

  const stages: StageSchema[] = sortStagesByPosition(config.stages)

  return (
    <TaskStageDndProvider teamId={teamId} config={config} onTaskCloseRequest={onTaskCloseRequest}>
      <ScrollArea type="always" className="mx-auto min-h-0 w-max max-w-full flex-1">
        <div className="divide-border flex min-h-[var(--scroll-area-height,100dvh)] w-max items-stretch divide-x divide-dashed">
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
                {tasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    teamId={teamId}
                    task={task}
                    config={config}
                    executor={(userId) => <ExecutorInfo teamId={teamId} userId={userId} />}
                  />
                ))}
              </DropStageColumn>
            )
          })}
        </div>
      </ScrollArea>
    </TaskStageDndProvider>
  )
}
