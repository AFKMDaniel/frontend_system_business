import { Calendar, ListTodo, Users } from 'lucide-react'
import { Outlet, generatePath, matchPath, useLocation, useParams } from 'react-router-dom'

import { teamApi } from '@/entities/team'
import { ROUTES } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { Layout } from '@/app/layouts/layout'

export function TeamLayout() {
  const { teamId } = useParams<'teamId'>()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const { data: team } = teamApi.useGetTeamQuery({ teamId: Number(teamId) }, { skip: !teamId })

  if (!teamId) {
    return null
  }

  const isTasksRoute = matchPath({ path: ROUTES.team, end: true }, pathname) != null

  return (
    <Layout
      title={team?.name ?? t('team.name')}
      fullWidth={isTasksRoute}
      tabs={[
        {
          label: t('team.tasks'),
          icon: ListTodo,
          to: generatePath(ROUTES.team, { teamId }),
          end: true,
        },
        {
          label: t('team.members'),
          icon: Users,
          to: generatePath(ROUTES.teamMembers, { teamId }),
        },
        {
          label: t('team.meetings'),
          icon: Calendar,
          to: generatePath(ROUTES.teamMeetings, { teamId }),
        },
      ]}
    >
      <Outlet />
    </Layout>
  )
}
