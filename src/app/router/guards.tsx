import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Loader2 } from 'lucide-react'

import { useAppSelector } from '@/app/providers/store'
import { userApi } from '@/entities/user/api'
import { selectAccessToken, selectAuthReady } from '@/entities/user/auth-slice'

type GuardProps = {
  children: ReactNode
  redirectTo?: string
}

type AuthGuardProps = GuardProps & {
  roles?: string[]
  forbiddenPath?: string
}

function RouteLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Loader2 className="size-6 animate-spin" />
    </div>
  )
}

export function GuestGuard({ children, redirectTo = '/' }: GuardProps) {
  const token = useAppSelector(selectAccessToken)
  const isReady = useAppSelector(selectAuthReady)

  if (!isReady) {
    return <RouteLoader />
  }

  if (token) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export function AuthGuard({
  children,
  roles = [],
  redirectTo = '/login',
  forbiddenPath = '/forbidden',
}: AuthGuardProps) {
  const token = useAppSelector(selectAccessToken)
  const isReady = useAppSelector(selectAuthReady)
  const location = useLocation()
  const { data: user, isLoading } = userApi.useGetUserMeQuery(undefined, {
    skip: !isReady || !token || roles.length === 0,
  })

  if (!isReady || (roles.length > 0 && isLoading)) {
    return <RouteLoader />
  }

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (roles.length > 0) {
    const userRoles = user?.roles.map((role) => role.name) ?? []
    const hasAccess = roles.some((role) => userRoles.includes(role))

    if (!hasAccess) {
      return <Navigate to={forbiddenPath} replace />
    }
  }

  return <>{children}</>
}
