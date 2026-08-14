import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { Providers } from '@/app/providers'
import { ForbiddenPage } from '@/pages/forbidden'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { HomePage } from '@/pages/home'
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
            <HomePage />
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
