import { Loader2 } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

import { userApi } from '../api'

export function UserInfo() {
  const { data: user, isLoading, isError } = userApi.useGetUserMeQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      </div>
    )
  }

  if (isError || !user) {
    return <p className="text-destructive py-6 text-center text-sm">Failed to load user info.</p>
  }

  return (
    <div className="flex w-full items-center gap-6 text-left lg:flex-col lg:items-start">
      <Avatar className="aspect-square size-40 lg:size-60">
        <AvatarFallback className="text-5xl font-semibold lg:text-7xl">
          {user.email.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1.5">
        <p className="truncate text-xl font-semibold">{user.email}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {user.roles.map((role) => (
            <span
              key={role.name}
              className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium"
            >
              {role.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
