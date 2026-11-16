import { ArrowLeft, ListTodo, Loader2 } from 'lucide-react'
import { generatePath, Link, useParams } from 'react-router-dom'

import { taskApi } from '@/entities/task'
import { useTranslation } from '@/shared/i18n'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'

import { TaskDetailsPanel } from './ui/task-details-panel'
import { TaskEditor } from './ui/task-editor'

export function TeamTaskPage() {
  const { teamId, taskId } = useParams<'teamId' | 'taskId'>()
  const { t } = useTranslation()

  const parsedTeamId = Number(teamId)
  const parsedTaskId = Number(taskId)
  const skip = !teamId || !taskId

  const {
    data: task,
    isLoading,
    isError,
  } = taskApi.useGetTaskByIdQuery(
    { teamId: parsedTeamId, taskId: parsedTaskId },
    { skip },
  )

  if (!teamId || !taskId) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <ListTodo className="size-5" />
        </div>
        <p className="text-sm font-medium">{t('task.details.loadError')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to={generatePath(ROUTES.team, { teamId })}>
          <ArrowLeft data-icon="inline-start" />
          {t('task.backToBoard')}
        </Link>
      </Button>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_16rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <TaskEditor teamId={parsedTeamId} task={task} />
        </div>

        <TaskDetailsPanel teamId={parsedTeamId} task={task} />
      </div>
    </div>
  )
}
