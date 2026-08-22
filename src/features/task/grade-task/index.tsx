import { yupResolver } from '@hookform/resolvers/yup'
import { number, object } from 'yup'

import { closeDialog } from '@/app/dialog'
import { useAppDispatch } from '@/app/providers/store'
import { taskApi } from '@/entities/task'
import type { GradeTask } from '@/entities/task'
import { i18n, useTranslation } from '@/shared/i18n'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { Button } from '@/shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/shared/ui/field'
import { FormRating } from '@/shared/ui/form/form-rating'

import type { GradeTaskDialogProps } from './types'

export type { GradeTaskDialogProps } from './types'

const gradeSchema = object({
  grade: number()
    .min(1, () => i18n.t('task.gradeDialog.errors.gradeRange'))
    .max(5, () => i18n.t('task.gradeDialog.errors.gradeRange'))
    .required(() => i18n.t('task.gradeDialog.errors.gradeRequired')),
})

type GradeTaskFormValues = { grade: number }

export function GradeTaskDialog({ teamId, taskId }: GradeTaskDialogProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [updateTaskStatus, { isLoading }] = taskApi.useUpdateTaskStatusMutation()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormWithErrorHandling<GradeTaskFormValues>({
    resolver: yupResolver(gradeSchema),
    defaultValues: { grade: 0 },
    fallback: t('task.gradeDialog.errors.failed'),
  })

  const onSubmit = handleSubmit(async ({ grade }) => {
    await updateTaskStatus({
      teamId,
      taskId,
      body: { status: 'closed', grade: grade as GradeTask },
    }).unwrap()
    dispatch(closeDialog())
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('task.gradeDialog.title')}</DialogTitle>
        <DialogDescription>{t('task.gradeDialog.description')}</DialogDescription>
      </DialogHeader>
      <form id="grade-task-form" onSubmit={onSubmit} noValidate>
        <Field>
          <FieldLabel>{t('task.gradeDialog.gradeLabel')}</FieldLabel>
          <FormRating control={control} name="grade" />
          <FieldError errors={[errors?.grade]} />
        </Field>
      </form>
      <DialogFooter>
        <Button form="grade-task-form" type="submit" disabled={isLoading}>
          {isLoading ? t('task.gradeDialog.submitting') : t('task.gradeDialog.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
