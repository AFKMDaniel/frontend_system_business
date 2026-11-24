import type { ReactNode } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { Feedback } from '@dnd-kit/dom'
import { toast } from 'sonner'

import type { DragEndEvent } from '@dnd-kit/react'

import { getAllowedStageIds, taskApi } from '@/entities/task'
import type { StageConfig } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { type ApiError } from '@/shared/api'
import { useTranslation } from '@/shared/i18n'
import { useAppDispatch } from '@/shared/lib/hooks'

import type { TaskCloseRequest, TaskDragData } from '../model/task-drag'

type TaskStageDndProviderProps = {
  teamId: number
  config: StageConfig
  children: ReactNode
  onTaskCloseRequest: (request: TaskCloseRequest) => void
}

export function TaskStageDndProvider({
  teamId,
  config,
  children,
  onTaskCloseRequest,
}: TaskStageDndProviderProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null
  const [updateTaskStage] = taskApi.useUpdateTaskStageMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source, target } = event.operation
    if (!source || !target) return

    const data = source.data as TaskDragData
    const targetStage = config.stages.find((stage) => stage.id === Number(target.id))
    if (!targetStage || targetStage.id === data.stageId) return

    const allowed = getAllowedStageIds(data.stageId, config, {
      isPrivileged,
      isExecutor: data.executorUserId === currentUserId,
      hasExecutor: data.executorUserId != null,
    })
    if (!allowed.includes(targetStage.id)) return

    if (targetStage.type === 'END') {
      const patch = dispatch(
        taskApi.util.updateQueryData('getTasks', { teamId }, (draft) => {
          const task = draft.entities[data.taskId]
          if (task) task.stage = targetStage
        }),
      )
      onTaskCloseRequest({
        teamId,
        taskId: data.taskId,
        stageId: targetStage.id,
        undo: () => patch?.undo(),
      })
      return
    }

    updateTaskStage({
      teamId,
      taskId: data.taskId,
      body: { stage_id: targetStage.id },
      stage: targetStage,
    })
      .unwrap()
      .catch((error: ApiError) => {
        toast.error(error.message || t('task.board.moveStageError'))
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
