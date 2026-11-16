import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Pencil, X } from 'lucide-react'
import { object, string } from 'yup'

import { taskApi } from '@/entities/task'
import { usePrivileged } from '@/entities/user'
import { i18n, useTranslation } from '@/shared/i18n'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { isEmptyRichText } from '@/shared/lib/rich-text'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { FormInput } from '@/shared/ui/form/form-input'
import { FormRichText } from '@/shared/ui/form/form-rich-text'
import { RichTextContent } from '@/shared/ui/rich-text'

import type { TaskSchema } from '@/entities/task'

const taskEditorSchema = object({
  title: string()
    .trim()
    .required(() => i18n.t('task.edit.errors.titleRequired')),
  description: string().default(''),
})

type TaskEditorProps = {
  teamId: number
  task: TaskSchema
}

type TaskEditorFormValues = {
  title: string
  description: string
}

const HEADING_CLASS = 'text-lg font-bold'

export function TaskEditor({ teamId, task }: TaskEditorProps) {
  const { t } = useTranslation()
  const canEdit = usePrivileged(teamId)

  const [isEditing, setIsEditing] = useState(false)
  const [updateTask, { isLoading }] = taskApi.useUpdateTaskMutation()

  const defaultValues = { title: task.title, description: task.description }

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useFormWithErrorHandling<TaskEditorFormValues>({
    resolver: yupResolver(taskEditorSchema),
    defaultValues,
    fallback: t('task.edit.errors.failed'),
  })

  useEffect(() => {
    if (!isEditing) {
      reset({ title: task.title, description: task.description })
    }
  }, [isEditing, reset, task.title, task.description])

  const cancel = () => {
    reset({ title: task.title, description: task.description })
    setIsEditing(false)
  }

  const onSubmit = handleSubmit(async ({ title, description }) => {
    const trimmedTitle = title.trim()
    const nextDescription = isEmptyRichText(description) ? null : description

    await updateTask({
      teamId,
      taskId: task.id,
      body: { title: trimmedTitle, description: nextDescription },
    }).unwrap()

    reset({ title: trimmedTitle, description: nextDescription ?? '' })
    setIsEditing(false)
  })

  if (isEditing) {
    return (
      <section className="flex flex-col gap-4">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          <FormInput
            control={control}
            name="title"
            label={t('task.edit.titleLabel')}
            labelClassName={HEADING_CLASS}
            placeholder={t('task.edit.titlePlaceholder')}
            className={cn('text-2xl md:text-2xl font-bold', 'h-auto py-1')}
            autoFocus
          />
          <div className="flex flex-col gap-2">
            <h2 className={HEADING_CLASS}>{t('task.description.title')}</h2>
            <FormRichText
              control={control}
              name="description"
              placeholder={t('task.description.placeholder')}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!isDirty || isLoading}>
              {isLoading ? t('task.edit.saving') : t('task.edit.save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={cancel}
            >
              <X data-icon="inline-start" />
              {t('task.edit.cancel')}
            </Button>
          </div>
        </form>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-bold break-words">{task.title}</h1>
        {canEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('task.edit.edit')}
            title={t('task.edit.edit')}
            onClick={() => setIsEditing(true)}
            className="shrink-0"
          >
            <Pencil />
          </Button>
        )}
      </div>

      <hr className="border-border border-t" />

      {!isEmptyRichText(task.description) ? (
        <RichTextContent value={task.description} className="text-base" />
      ) : (
        <p className="text-muted-foreground text-base italic">{t('task.description.empty')}</p>
      )}
    </section>
  )
}
