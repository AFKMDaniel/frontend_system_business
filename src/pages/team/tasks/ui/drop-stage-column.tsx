import { useMemo, type ReactNode } from 'react'
import { useDroppable, useDragOperation } from '@dnd-kit/react'

import { getAllowedStageIds } from '@/entities/task'
import type { StageConfig, StageSchema } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'

import type { TaskDragData } from '../model/task-drag'

type DropStageColumnProps = {
  stage: StageSchema
  count: number
  teamId: number
  config: StageConfig
  children: ReactNode
}

export function DropStageColumn({ stage, count, teamId, config, children }: DropStageColumnProps) {
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null

  const isAllowed = useMemo(
    () => (sourceData: TaskDragData) =>
      getAllowedStageIds(sourceData.stageId, config, {
        isPrivileged,
        isExecutor: sourceData.executorUserId === currentUserId,
        hasExecutor: sourceData.executorUserId != null,
      }).includes(stage.id),
    [config, isPrivileged, currentUserId, stage.id],
  )

  const { ref, isDropTarget } = useDroppable({
    id: stage.id,
    accept: (source) => isAllowed(source.data as TaskDragData),
  })

  const { source } = useDragOperation()
  const acceptsSource = source != null && isAllowed(source.data as TaskDragData)
  const isDisabled = source != null && !acceptsSource

  return (
    <section
      ref={ref}
      className={cn(
        'flex w-72 shrink-0 flex-col gap-3 p-4 transition-colors',
        isDropTarget && 'bg-muted/50',
        isDisabled && 'opacity-40',
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{stage.name}</h2>
        <Badge variant="secondary">{count}</Badge>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
