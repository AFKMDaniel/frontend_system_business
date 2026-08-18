import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'

import { selectAllMembers } from '@/entities/team'
import { teamApi } from '@/entities/team'
import { selectTasksByStatus } from '@/entities/task'
import { taskApi } from '@/entities/task'
import { userApi } from '@/entities/user'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { DatePicker } from '@/shared/ui/date-picker'
import { FilterGroup } from '@/shared/ui/filter-group'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/shared/ui/combobox'

import type { TaskListParams } from '@/entities/task'

import { TaskBoardBody } from './ui/task-board-body'

type ExecutorOption = {
  id: string
  label: string
  userId?: number
}

export function TeamTaskBoard() {
  const { teamId } = useParams<'teamId'>()
  const skip = !teamId

  const [executorId, setExecutorId] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const params = useMemo<TaskListParams>(() => {
    const next: TaskListParams = {}
    if (executorId != null) {
      next.executor_user_id = executorId
    }
    if (dateRange?.from) {
      next.start_date = format(dateRange.from, 'yyyy-MM-dd')
    }
    if (dateRange?.to) {
      next.end_date = format(dateRange.to, 'yyyy-MM-dd')
    }
    return next
  }, [executorId, dateRange])

  const {
    data: tasksByStatus,
    isFetching,
    isError,
  } = taskApi.useGetTasksQuery(
    { teamId: Number(teamId), params },
    {
      skip,
      selectFromResult: ({ data, isFetching, isError }) => ({
        data: data ? selectTasksByStatus(data) : null,
        isFetching,
        isError,
      }),
    },
  )
  const { data: members } = teamApi.useGetTeamMembersQuery(
    { teamId: Number(teamId) },
    {
      skip,
      selectFromResult: ({ data }) => ({
        data: data ? selectAllMembers(data) : undefined,
      }),
    },
  )
  const { data: currentUser } = userApi.useGetUserMeQuery()

  const executorOptions = useMemo<ExecutorOption[]>(
    () => [
      { id: 'all', label: 'All executors' },
      ...(members ?? []).map((member) => ({
        id: String(member.user.id),
        label: member.user.email,
        userId: member.user.id,
      })),
    ],
    [members],
  )

  const selectedExecutor = useMemo(
    () =>
      executorOptions.find((option) =>
        option.id === 'all' ? executorId == null : option.id === String(executorId),
      ) ?? executorOptions[0],
    [executorOptions, executorId],
  )

  if (!teamId) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <FilterGroup label="Assignee">
          <Combobox
            items={executorOptions}
            value={selectedExecutor}
            onValueChange={(option) =>
              setExecutorId(option && option.id !== 'all' ? Number(option.id) : null)
            }
            itemToStringValue={(option) =>
              option.userId != null && option.userId === currentUser?.id
                ? `${option.label} (me)`
                : option.label
            }
          >
            <ComboboxTrigger
              render={<Button variant="outline" className="w-56 justify-between font-normal" />}
            >
              <ComboboxValue />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput showTrigger={false} placeholder="Search executor" />
              <ComboboxEmpty>No executors found.</ComboboxEmpty>
              <ComboboxList>
                {(option) => (
                  <ComboboxItem key={option.id} value={option}>
                    {option.userId != null && (
                      <Avatar size="sm">
                        <AvatarFallback>{option.label.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="truncate">
                      {option.label}
                      {option.userId != null && option.userId === currentUser?.id && (
                        <span className="text-muted-foreground"> (me)</span>
                      )}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FilterGroup>

        <FilterGroup label="Date range">
          <DatePicker mode="range" value={dateRange} onSelect={setDateRange} />
        </FilterGroup>
      </div>

      <TaskBoardBody
        isFetching={isFetching}
        isError={isError}
        tasksByStatus={tasksByStatus}
        teamId={Number(teamId)}
      />
    </div>
  )
}
