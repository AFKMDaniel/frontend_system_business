import { Calendar, ListTodo, Users } from 'lucide-react'
import { Outlet, generatePath, useParams } from 'react-router-dom'

import { teamApi } from '@/entities/team'
import { ROUTES } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { Layout } from '@/widgets/layout'

export function TeamLayout() {
  const { teamId } = useParams<'teamId'>()
  const { t } = useTranslation()

  const { data: team } = teamApi.useGetTeamQuery({ teamId: Number(teamId) }, { skip: !teamId })

  if (!teamId) {
    return null
  }

  return (
    <Layout
      title={team?.name ?? t('team.name')}
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
