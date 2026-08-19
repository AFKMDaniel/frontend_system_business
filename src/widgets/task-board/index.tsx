import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'

import { selectAllMembers } from '@/entities/team'
import { teamApi } from '@/entities/team'
import { selectTasksByStatus } from '@/entities/task'
import { taskApi } from '@/entities/task'
import { userApi } from '@/entities/user'
import { useTranslation } from '@/shared/i18n'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { FilterGroup } from '@/shared/ui/filter-group'
import { FormCombobox } from '@/shared/ui/form/form-combobox'
import { FormDatePicker } from '@/shared/ui/form/form-date-picker'
import {
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
  value: string
  label: string
  userId?: number
}

type TaskFilterFormValues = {
  executor: ExecutorOption
  dateRange?: DateRange
}

export function TeamTaskBoard() {
  const { teamId } = useParams<'teamId'>()
  const skip = !teamId
  const { t } = useTranslation()

  const { data: members } = teamApi.useGetTeamMembersQuery(
    { teamId: Number(teamId) },
    {
      skip,
      selectFromResult: ({ data }) => ({
        data: data ? selectAllMembers(data) : undefined,
      }),
    },
  )

  const executorOptions = useMemo<ExecutorOption[]>(
    () => [
      { value: 'all', label: t('task.board.allExecutors') },
      ...(members ?? []).map((member) => ({
        value: String(member.user.id),
        label: member.user.email,
        userId: member.user.id,
      })),
    ],
    [members, t],
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TaskFilterFormValues>({
    defaultValues: {
      executor: executorOptions[0],
      dateRange: undefined,
    },
  })
  const [appliedFilters, setAppliedFilters] = useState<{
    executorId: number | null
    dateRange?: DateRange
  }>({ executorId: null })

  const params = useMemo<TaskListParams>(() => {
    const next: TaskListParams = {}
    if (appliedFilters.executorId != null) {
      next.executor_user_id = appliedFilters.executorId
    }
    if (appliedFilters.dateRange?.from) {
      next.start_date = format(appliedFilters.dateRange.from, 'yyyy-MM-dd')
    }
    if (appliedFilters.dateRange?.to) {
      next.end_date = format(appliedFilters.dateRange.to, 'yyyy-MM-dd')
    }
    return next
  }, [appliedFilters])

  const onSubmit = handleSubmit((values) => {
    setAppliedFilters({
      executorId:
        values.executor && values.executor.value !== 'all' ? Number(values.executor.value) : null,
      dateRange: values.dateRange,
    })
    reset(values)
  })

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

  const { data: currentUser } = userApi.useGetUserMeQuery()

  if (!teamId) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          <FilterGroup label={t('task.board.assignee')}>
            <FormCombobox
              control={control}
              name="executor"
              items={executorOptions}
              itemToStringLabel={(option) =>
                executorOptions.find((item) => item.value === option.value)?.label ?? option.label
              }
            >
              <ComboboxTrigger
                type="button"
                render={<Button variant="outline" className="w-56 justify-between font-normal" />}
              >
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput showTrigger={false} placeholder={t('task.board.searchExecutor')} />
                <ComboboxEmpty>{t('task.board.noExecutors')}</ComboboxEmpty>
                <ComboboxList>
                  {(option) => (
                    <ComboboxItem key={option.value} value={option}>
                      {option.userId != null && (
                        <Avatar size="sm">
                          <AvatarFallback>{option.label.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                      <span className="truncate">
                        {option.label}
                        {option.userId != null && option.userId === currentUser?.id && (
                          <span className="text-muted-foreground"> ({t('task.board.me')})</span>
                        )}
                      </span>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </FormCombobox>
          </FilterGroup>

          <FilterGroup label={t('task.board.dateRange')}>
            <FormDatePicker control={control} name="dateRange" mode="range" />
          </FilterGroup>

          <Button type="submit" disabled={!isDirty} className="mt-5.5">
            {t('task.board.apply')}
          </Button>
        </div>
      </form>

      <TaskBoardBody
        isFetching={isFetching}
        isError={isError}
        tasksByStatus={tasksByStatus}
        teamId={Number(teamId)}
      />
    </div>
  )
}
