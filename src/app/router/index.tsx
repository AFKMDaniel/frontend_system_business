import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { AuthProvider } from '@/app/providers/auth-provider'
import { DashboardPage } from '@/pages/dashboard'
import { ForbiddenPage } from '@/pages/forbidden'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { AuthGuard, GuestGuard } from './guards'

export const router = createBrowserRouter([
  {
    element: (
      <>
        <AuthProvider />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/login',
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      {
        path: '/',
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        ),
      },
      {
        path: '/forbidden',
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
