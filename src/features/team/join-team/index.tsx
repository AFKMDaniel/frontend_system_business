import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { closeDialog } from '@/app/dialog'
import { userApi } from '@/entities/user'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { i18n, useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { FormInput } from '@/shared/ui/form-input'

export type { JoinTeamDialogProps } from './types'

const joinTeamSchema = object({
  inviteCode: string()
    .trim()
    .required(() => i18n.t('team.join.errors.inviteCodeRequired')),
})

type JoinTeamFormValues = { inviteCode: string }

export function JoinTeamDialog() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [joinTeam, { isLoading }] = userApi.useJoinTeamMutation()
  const { control, handleSubmit } = useFormWithErrorHandling<JoinTeamFormValues>({
    resolver: yupResolver(joinTeamSchema),
    defaultValues: { inviteCode: '' },
    fallback: t('team.join.errors.failed'),
  })

  const onSubmit = handleSubmit(async ({ inviteCode }) => {
    await joinTeam({ inviteCode }).unwrap()
    dispatch(closeDialog())
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('team.join.title')}</DialogTitle>
        <DialogDescription>{t('team.join.description')}</DialogDescription>
      </DialogHeader>
      <form id="join-team-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormInput
          control={control}
          name="inviteCode"
          label={t('team.join.inviteCodeLabel')}
          placeholder={t('team.join.inviteCodePlaceholder')}
          autoFocus
        />
      </form>
      <DialogFooter>
        <Button form="join-team-form" type="submit" disabled={isLoading}>
          {isLoading ? t('team.join.submitting') : t('team.join.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
