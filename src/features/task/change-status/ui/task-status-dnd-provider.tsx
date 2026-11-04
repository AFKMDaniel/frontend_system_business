import type { ReactNode } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { Feedback } from '@dnd-kit/dom'
import { toast } from 'sonner'

import type { DragEndEvent } from '@dnd-kit/react'

import { openDialog } from '@/shared/model/dialog'
import { useAppDispatch } from '@/shared/lib/redux'
import { getAllowedStatuses, TASK_STATUSES, taskApi } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { type ApiError } from '@/shared/api/error'
import { useTranslation } from '@/shared/i18n'

import type { StatusTask } from '@/entities/task'

import type { TaskDragData } from '../types'

type TaskStatusDndProviderProps = {
  teamId: number
  children: ReactNode
}

export function TaskStatusDndProvider({ teamId, children }: TaskStatusDndProviderProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null
  const [updateTaskStatus] = taskApi.useUpdateTaskStatusMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source, target } = event.operation
    if (!source || !target) return

    const data = source.data as TaskDragData
    const targetStatus = TASK_STATUSES.includes(target.id as StatusTask)
      ? (target.id as StatusTask)
      : null
    if (!targetStatus || targetStatus === data.status) return

    const allowed = getAllowedStatuses(data, {
      isPrivileged,
      isExecutor: data.executorUserId === currentUserId,
    })
    if (!allowed.includes(targetStatus)) return

    if (targetStatus === 'closed') {
      const patch = dispatch(
        taskApi.util.updateQueryData('getTasks', { teamId }, (draft) => {
          const task = draft.entities[data.taskId]
          if (task) task.status = targetStatus
        }),
      )
      dispatch(
        openDialog({
          id: 'grade-task',
          props: { teamId, taskId: data.taskId },
          onClose: () => {
            patch?.undo()
          },
        }),
      )
      return
    }

    updateTaskStatus({ teamId, taskId: data.taskId, body: { status: targetStatus } })
      .unwrap()
      .catch((error: ApiError) => {
        toast.error(error.message || t('task.board.moveStatusError'))
      })
  }

  return (
    <DragDropProvider
      plugins={(defaults) => [...defaults, Feedback.configure({ dropAnimation: null })]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  )
}
