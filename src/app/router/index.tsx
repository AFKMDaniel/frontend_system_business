import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { Providers } from '@/app/providers'
import { ROUTES } from '@/shared/config'
import { ForbiddenPage } from '@/pages/forbidden'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { HomePage } from '@/pages/home'
import { TeamMembersPage } from '@/pages/team/members'
import { TeamMeetingsPage } from '@/pages/team/meetings'
import { TeamTasksPage } from '@/pages/team/tasks'
import { TeamLayout } from '@/widgets/team-layout'
import { HomeLayout } from '@/widgets/home-layout'
import { AuthGuard, GuestGuard } from './guards'

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <Outlet />
      </Providers>
    ),
    children: [
      {
        path: ROUTES.login,
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      {
        path: ROUTES.register,
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: ROUTES.home,
        element: (
          <AuthGuard>
            <HomeLayout />
          </AuthGuard>
        ),
        children: [{ index: true, element: <HomePage /> }],
      },
      {
        path: ROUTES.team,
        element: (
          <AuthGuard>
            <TeamLayout />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <TeamTasksPage /> },
          { path: ROUTES.teamMembers, element: <TeamMembersPage /> },
          { path: ROUTES.teamMeetings, element: <TeamMeetingsPage /> },
        ],
      },
      {
        path: ROUTES.forbidden,
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.home} replace />,
      },
    ],
  },
])
