import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'

import { taskApi } from '@/entities/task'
import { teamApi } from '@/entities/team'
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

import type { StatusTask, TaskListParams, TaskSchema } from '@/entities/task'

import { TaskListBody } from './ui/task-list-body'
import type { TaskListItem } from './ui/task-list-body'

type ExecutorOption = {
  id: string
  label: string
}

const STATUS_OPTIONS: { value: StatusTask | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'work', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
]

export function TeamTaskList() {
  const { teamId } = useParams<'teamId'>()
  const skip = !teamId

  const [onlyMy, setOnlyMy] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusTask | 'all'>('all')
  const [executorId, setExecutorId] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const params = useMemo<TaskListParams>(() => {
    const next: TaskListParams = {}
    if (onlyMy) {
      next.only_my = true
    }
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
  }, [onlyMy, executorId, dateRange])

  const { data: tasks, isLoading, isError } = taskApi.useGetTasksQuery(
    { teamId: Number(teamId), params },
    { skip },
  )
  const { data: team } = teamApi.useGetTeamMembersQuery(
    { teamId: Number(teamId) },
    { skip },
  )

  const executorOptions = useMemo<ExecutorOption[]>(
    () => [
      { id: 'all', label: 'All executors' },
      ...(team?.members ?? []).map((member) => ({
        id: String(member.user.id),
        label: member.user.email,
      })),
    ],
    [team],
  )

  const selectedExecutor = useMemo(
    () =>
      executorOptions.find((option) =>
        option.id === 'all'
          ? executorId == null
          : option.id === String(executorId),
      ) ?? executorOptions[0],
    [executorOptions, executorId],
  )

  const filtered = useMemo<TaskListItem[]>(() => {
    const members = team?.members ?? []
    const executorEmail = (task: TaskSchema): string =>
      members.find((member) => member.user.id === task.executor_user_id)?.user.email ??
      String(task.executor_user_id)

    return (tasks ?? [])
      .filter((task) => statusFilter === 'all' || task.status === statusFilter)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .map((task) => ({ task, executor: executorEmail(task) }))
  }, [tasks, team, statusFilter])

  if (!teamId) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        <FilterGroup label="Assignee">
          <div className="flex items-center gap-1">
            <Button
              variant={!onlyMy ? 'secondary' : 'ghost'}
              onClick={() => setOnlyMy(false)}
            >
              All
            </Button>
            <Button
              variant={onlyMy ? 'secondary' : 'ghost'}
              onClick={() => setOnlyMy(true)}
            >
              Mine
            </Button>
          </div>
          <Combobox
            items={executorOptions}
            value={selectedExecutor}
            onValueChange={(option) =>
              setExecutorId(
                option && option.id !== 'all' ? Number(option.id) : null,
              )
            }
            itemToStringValue={(option) => option.label}
          >
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  className="w-56 justify-between font-normal"
                />
              }
            >
              <ComboboxValue />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput showTrigger={false} placeholder="Search executor" />
              <ComboboxEmpty>No executors found.</ComboboxEmpty>
              <ComboboxList>
                {(option) => (
                  <ComboboxItem key={option.id} value={option}>
                    {option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FilterGroup>

        <FilterGroup label="Status">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? 'secondary' : 'ghost'}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </FilterGroup>

        <FilterGroup label="Date range">
          <DatePicker
            mode="range"
            value={dateRange}
            onSelect={setDateRange}
          />
        </FilterGroup>
      </div>

      <TaskListBody isLoading={isLoading} isError={isError} filtered={filtered} />
    </div>
  )
}
