import { yupResolver } from '@hookform/resolvers/yup'
import { number, object } from 'yup'

import { closeDialog } from '@/shared/model'
import { useAppDispatch, useFormWithErrorHandling } from '@/shared/lib/hooks'
import { taskApi } from '@/entities/task'
import type { GradeTask } from '@/entities/task'
import { i18n, useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/shared/ui/field'
import { FormRating } from '@/shared/ui/form'

import type { GradeTaskDialogProps } from './model/grade-task'

export type { GradeTaskDialogProps } from './model/grade-task'

const gradeSchema = object({
  grade: number()
    .min(1, () => i18n.t('task.gradeDialog.errors.gradeRange'))
    .max(5, () => i18n.t('task.gradeDialog.errors.gradeRange'))
    .required(() => i18n.t('task.gradeDialog.errors.gradeRequired')),
})

type GradeTaskFormValues = { grade: number }

export function GradeTaskDialog({ teamId, taskId, stageId }: GradeTaskDialogProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [updateTaskStage, { isLoading }] = taskApi.useUpdateTaskStageMutation()
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
    await updateTaskStage({
      teamId,
      taskId,
      body: { stage_id: stageId, grade: grade as GradeTask },
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
