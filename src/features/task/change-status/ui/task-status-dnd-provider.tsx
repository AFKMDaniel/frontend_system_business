import type { ReactNode } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { toast } from 'sonner'

import type { DragEndEvent } from '@dnd-kit/react'

import { DIALOG_IDS, openDialog } from '@/app/dialog'
import { useAppDispatch } from '@/app/providers/store'
import { getAllowedStatuses, TASK_STATUSES, taskApi } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { normalizeApiError } from '@/shared/api/error'
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
      dispatch(openDialog({ id: DIALOG_IDS.gradeTask, props: { teamId, taskId: data.taskId } }))
      return
    }

    updateTaskStatus({ teamId, taskId: data.taskId, body: { status: targetStatus } })
      .unwrap()
      .catch((error: unknown) => {
        const parsed =
          typeof error === 'object' && error !== null && 'status' in error
            ? normalizeApiError(error as FetchBaseQueryError)
            : null
        toast.error(parsed?.message || t('task.board.moveStatusError'))
      })
  }

  return <DragDropProvider onDragEnd={handleDragEnd}>{children}</DragDropProvider>
}
