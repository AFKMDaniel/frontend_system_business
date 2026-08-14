import { Loader2, Users } from 'lucide-react'

import { useAppDispatch } from '@/app/providers/store'
import { DIALOG_IDS, openDialog } from '@/app/dialog'
import { UserInfo, userApi } from '@/entities/user'
import { Layout } from '@/widgets/layout'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { data: user, isLoading, isError } = userApi.useGetUserMeQuery()
  const teams = user?.teams ?? []

  const openJoinTeamDialog = () => dispatch(openDialog({ id: DIALOG_IDS.joinTeam }))

  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 grid-rows-1 items-start justify-items-center gap-6 lg:grid-cols-[240px_1fr]">
        <UserInfo />

        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Teams</h1>
            <p className="text-muted-foreground text-sm">All teams you are part of</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
          ) : isError ? (
            <p className="text-destructive text-sm">Failed to load teams.</p>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                <Users className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-medium">You're not part of any team yet</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Ask your manager to add you to a team, or join one with an invite code.
                </p>
              </div>
              <Button onClick={openJoinTeamDialog}>Join a team</Button>
            </div>
          ) : (
            <ul className="bg-card divide-y overflow-hidden rounded-lg border">
              {teams.map((membership) => (
                <li
                  key={membership.team.id}
                  className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3 transition-colors"
                >
                  <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <Users className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{membership.team.name}</p>
                    {membership.role ? (
                      <p className="text-muted-foreground text-xs">{membership.role}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}
