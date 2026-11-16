import { useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'

import { ExecutorInfo, selectAllMembers, teamApi } from '@/entities/team'
import {
  getAllowedStatuses,
  STATUS_LABEL_KEYS,
  taskApi,
} from '@/entities/task'
import { userApi, usePrivileged } from '@/entities/user'
import { formatDate, useTranslation } from '@/shared/i18n'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Rating } from '@/shared/ui/rating'

import type { StatusTask, TaskSchema } from '@/entities/task'

type TaskDetailsPanelProps = {
  teamId: number
  task: TaskSchema
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      {children}
    </div>
  )
}

export function TaskDetailsPanel({ teamId, task }: TaskDetailsPanelProps) {
  const { t } = useTranslation()
  const isPrivileged = usePrivileged(teamId)
  const { data: currentUser } = userApi.useGetUserMeQuery()
  const isExecutor = task.executor_user_id === (currentUser?.id ?? null)

  const [updateTaskStatus] = taskApi.useUpdateTaskStatusMutation()
  const [updateTaskExecutor] = taskApi.useUpdateTaskExecutorMutation()
  const [updateTask] = taskApi.useUpdateTaskMutation()
  const { data: membersData } = teamApi.useGetTeamMembersQuery(
    { teamId },
    {
      selectFromResult: ({ data }) => ({
        data: data ? selectAllMembers(data) : undefined,
      }),
    },
  )
  const members = membersData ?? []

  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  const deadlineDate = task.deadline ? new Date(task.deadline) : undefined
  const canEditDeadline = isPrivileged
  // The backend only persists executor changes while the task is still open.
  const canEditAssignee = isPrivileged && task.status === 'open'

  const allowedStatuses = getAllowedStatuses(
    { status: task.status, executorUserId: task.executor_user_id },
    { isPrivileged, isExecutor },
  )

  const handleStatusChange = async (status: StatusTask) => {
    try {
      await updateTaskStatus({ teamId, taskId: task.id, body: { status } }).unwrap()
    } catch {
      toast.error(t('task.details.changeStatusError'))
    }
  }

  const handleAssigneeChange = async (userId: number | null) => {
    try {
      await updateTaskExecutor({ teamId, taskId: task.id, body: { executor_user_id: userId } }).unwrap()
    } catch {
      toast.error(t('task.details.changeAssigneeError'))
    }
  }

  const handleDeadlineChange = async (date: Date | undefined) => {
    setIsDeadlineOpen(false)

    try {
      await updateTask({
        teamId,
        taskId: task.id,
        body: { deadline: date ? date.toISOString().slice(0, 10) : null },
      }).unwrap()
    } catch {
      toast.error(t('task.details.changeDeadlineError'))
    }
  }

  return (
    <aside className="bg-card flex flex-col gap-3 rounded-lg border p-4">
      <h2 className="text-lg font-bold">{t('task.details.title')}</h2>

      <DetailRow label={t('task.details.status')}>
        {allowedStatuses.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs" className="gap-1">
                <Badge variant="secondary">{t(STATUS_LABEL_KEYS[task.status])}</Badge>
                <ChevronDown className="text-muted-foreground size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {allowedStatuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => void handleStatusChange(status)}>
                  {t(STATUS_LABEL_KEYS[status])}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Badge variant="secondary">{t(STATUS_LABEL_KEYS[task.status])}</Badge>
        )}
      </DetailRow>

      <DetailRow label={t('task.details.assignee')}>
        {canEditAssignee ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs" className="gap-1">
                <ExecutorInfo teamId={teamId} userId={task.executor_user_id} />
                <ChevronDown className="text-muted-foreground size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              <DropdownMenuItem onClick={() => void handleAssigneeChange(null)}>
                {t('executor.unassigned')}
              </DropdownMenuItem>
              {(members ?? []).map((member) => (
                <DropdownMenuItem
                  key={member.user.id}
                  onClick={() => void handleAssigneeChange(member.user.id)}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{member.user.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{member.user.email}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ExecutorInfo teamId={teamId} userId={task.executor_user_id} />
        )}
      </DetailRow>

      <DetailRow label={t('task.details.deadline')}>
        {canEditDeadline && deadlineDate ? (
          <Popover open={isDeadlineOpen} onOpenChange={setIsDeadlineOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="xs" className="gap-1">
                <CalendarDays className="text-muted-foreground size-3.5" />
                {formatDate(deadlineDate, 'd MMM yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={deadlineDate}
                defaultMonth={deadlineDate}
                onSelect={(date) => void handleDeadlineChange(date)}
              />
            </PopoverContent>
          </Popover>
        ) : deadlineDate ? (
          <span className="text-xs">
            {formatDate(deadlineDate, 'd MMM yyyy')}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </DetailRow>

      {task.close_date && (
        <DetailRow label={t('task.details.closed')}>
          <span className="text-xs">{formatDate(new Date(task.close_date), 'd MMM yyyy')}</span>
        </DetailRow>
      )}

      <DetailRow label={t('task.details.grade')}>
        {task.grade != null ? <Rating rate={task.grade} /> : <span className="text-muted-foreground text-xs">—</span>}
      </DetailRow>
    </aside>
  )
}
