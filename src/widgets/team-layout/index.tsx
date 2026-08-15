import { Calendar, ListTodo, Users } from 'lucide-react'
import { Outlet, generatePath, useParams } from 'react-router-dom'

import { teamApi } from '@/entities/team'
import { ROUTES } from '@/shared/config'
import { Layout } from '@/widgets/layout'

export function TeamLayout() {
  const { teamId } = useParams<'teamId'>()

  const { data: team } = teamApi.useGetTeamQuery({ teamId: Number(teamId) }, { skip: !teamId })

  if (!teamId) {
    return null
  }

  return (
    <Layout
      title={team?.name ?? 'Team'}
      tabs={[
        {
          label: 'Tasks',
          icon: ListTodo,
          to: generatePath(ROUTES.team, { teamId }),
          end: true,
        },
        {
          label: 'Members',
          icon: Users,
          to: generatePath(ROUTES.teamMembers, { teamId }),
        },
        {
          label: 'Meetings',
          icon: Calendar,
          to: generatePath(ROUTES.teamMeetings, { teamId }),
        },
      ]}
    >
      <Outlet />
    </Layout>
  )
}
