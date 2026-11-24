import { useMemo, type ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/react'

import { getAllowedStageIds, TaskCard } from '@/entities/task'
import type { StageConfig, TaskSchema } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { cn } from '@/shared/lib/utils'

type DraggableTaskCardProps = {
  teamId: number
  task: TaskSchema
  config: StageConfig
  executor: (userId: number | null) => ReactNode
}

export function DraggableTaskCard({ teamId, task, config, executor }: DraggableTaskCardProps) {
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null
  const isExecutor = task.executor_user_id === currentUserId
  const isMovable = useMemo(
    () =>
      (isPrivileged || isExecutor) &&
      getAllowedStageIds(task.stage.id, config, {
        isPrivileged,
        isExecutor,
        hasExecutor: task.executor_user_id != null,
      }).length > 0,
    [isPrivileged, isExecutor, task.stage.id, task.executor_user_id, config],
  )

  const { ref, isDragging } = useDraggable({
    id: task.id,
    data: { taskId: task.id, stageId: task.stage.id, executorUserId: task.executor_user_id },
    disabled: !isMovable,
  })

  return (
    <div
      ref={ref}
      className={cn(isMovable && 'cursor-grab', isDragging && 'opacity-60')}
    >
      <TaskCard task={task} executor={executor} />
    </div>
  )
}
