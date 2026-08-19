import { Loader2, Users } from 'lucide-react'

import { useAppDispatch } from '@/app/providers/store'
import { DIALOG_IDS, openDialog } from '@/app/dialog'
import { UserInfo, userApi } from '@/entities/user'
import { TeamListItem } from '@/entities/team'
import { useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { data: user, isLoading, isError } = userApi.useGetUserMeQuery()
  const teams = user?.teams ?? []

  const openJoinTeamDialog = () => dispatch(openDialog({ id: DIALOG_IDS.joinTeam }))

  return (
    <div className="grid grid-cols-1 grid-rows-1 items-start justify-items-center gap-6 lg:grid-cols-[240px_1fr]">
      <UserInfo />

      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">{t('home.teams')}</h1>
          <p className="text-muted-foreground text-sm">{t('home.teamsSubtitle')}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-destructive text-sm">{t('home.teamsError')}</p>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
            <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-medium">{t('home.noTeams')}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t('home.noTeamsHint')}</p>
            </div>
            <Button onClick={openJoinTeamDialog}>{t('home.joinTeam')}</Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {teams.map((membership) => (
              <TeamListItem key={membership.team.id} membership={membership} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
