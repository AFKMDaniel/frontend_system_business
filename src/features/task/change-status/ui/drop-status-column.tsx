import type { ReactNode } from 'react'
import { useDroppable, useDragOperation } from '@dnd-kit/react'

import { getAllowedStatuses, STATUS_LABEL_KEYS } from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'

import type { StatusTask } from '@/entities/task'

import type { TaskDragData } from '../types'

type DropStatusColumnProps = {
  status: StatusTask
  count: number
  teamId: number
  children: ReactNode
}

export function DropStatusColumn({ status, count, teamId, children }: DropStatusColumnProps) {
  const { t } = useTranslation()
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const currentUserId = currentUser?.id ?? null

  const { ref, isDropTarget } = useDroppable({
    id: status,
    accept: (source) => {
      const data = source.data as TaskDragData
      return getAllowedStatuses(data, {
        isPrivileged,
        isExecutor: data.executorUserId === currentUserId,
      }).includes(status)
    },
  })

  const { source } = useDragOperation()
  const acceptsSource =
    source != null &&
    getAllowedStatuses(source.data as TaskDragData, {
      isPrivileged,
      isExecutor: (source.data as TaskDragData).executorUserId === currentUserId,
    }).includes(status)
  const isDisabled = source != null && !acceptsSource

  return (
    <section
      ref={ref}
      className={cn(
        'bg-card flex flex-col gap-3 rounded-lg border p-3 transition-all',
        isDropTarget && 'border-primary bg-muted/50',
        isDisabled && 'opacity-40',
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{t(STATUS_LABEL_KEYS[status])}</h2>
        <Badge variant="secondary">{count}</Badge>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
