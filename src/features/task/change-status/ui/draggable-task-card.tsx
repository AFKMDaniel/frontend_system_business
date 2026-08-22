import type { ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/react'

import { DIALOG_IDS, selectDialogContent } from '@/app/dialog'
import { useAppSelector } from '@/app/providers/store'
import { getAllowedStatuses, TaskCard } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { cn } from '@/shared/lib/utils'

import type { TaskSchema } from '@/entities/task'

type DraggableTaskCardProps = {
  teamId: number
  task: TaskSchema
  executor: (userId: number | null) => ReactNode
}

export function DraggableTaskCard({ teamId, task, executor }: DraggableTaskCardProps) {
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null
  const isExecutor = task.executor_user_id === currentUserId
  const isMovable =
    (isPrivileged || isExecutor) &&
    getAllowedStatuses(
      { status: task.status, executorUserId: task.executor_user_id },
      { isPrivileged, isExecutor },
    ).length > 0

  const isHidden = useAppSelector((state) => {
    const content = selectDialogContent(state)
    return content?.id === DIALOG_IDS.gradeTask && content.props?.taskId === task.id
  })

  const { ref, isDragging } = useDraggable({
    id: task.id,
    data: { taskId: task.id, status: task.status, executorUserId: task.executor_user_id },
    disabled: !isMovable,
  })

  return (
    <div
      ref={ref}
      className={cn(isMovable && 'cursor-grab', isDragging && 'opacity-60', isHidden && 'opacity-0')}
    >
      <TaskCard task={task} executor={executor} />
    </div>
  )
}
