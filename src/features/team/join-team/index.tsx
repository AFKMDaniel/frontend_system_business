import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { closeDialog } from '@/app/dialog'
import { userApi } from '@/entities/user'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { Button } from '@/shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { FormInput } from '@/shared/ui/form-input'

export type { JoinTeamDialogProps } from './types'

const joinTeamSchema = object({
  inviteCode: string().trim().required('Invite code is required'),
})

type JoinTeamFormValues = { inviteCode: string }

export function JoinTeamDialog() {
  const dispatch = useAppDispatch()
  const [joinTeam, { isLoading }] = userApi.useJoinTeamMutation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormWithErrorHandling<JoinTeamFormValues>({
    resolver: yupResolver(joinTeamSchema),
    defaultValues: { inviteCode: '' },
    fallback: 'Failed to join the team',
  })

  const onSubmit = handleSubmit(async ({ inviteCode }) => {
    await joinTeam({ inviteCode }).unwrap()
    dispatch(userApi.util.invalidateTags(['User']))
    reset()
    dispatch(closeDialog())
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Join a team</DialogTitle>
        <DialogDescription>
          Enter the invite code shared by your manager to join a team.
        </DialogDescription>
      </DialogHeader>
      <form id="join-team-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormInput
          control={control}
          name="inviteCode"
          label="Invite code"
          placeholder="e.g. ABC123"
          autoFocus
        />
        {errors.root ? <p className="text-destructive text-sm">{errors.root.message}</p> : null}
      </form>
      <DialogFooter>
        <Button form="join-team-form" type="submit" disabled={isLoading}>
          {isLoading ? 'Joining…' : 'Join team'}
        </Button>
      </DialogFooter>
    </>
  )
}
