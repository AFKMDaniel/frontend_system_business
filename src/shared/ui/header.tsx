import { LogOut, User, UserPlus, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { DIALOG_IDS, openDialog } from '@/app/dialog'
import { useAppDispatch } from '@/app/providers/store'
import { userApi } from '@/entities/user'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

export type HeaderTab = {
  label: string
  to: string
  end?: boolean
  icon: LucideIcon
}

type HeaderProps = {
  title: string
  tabs?: HeaderTab[]
}

export function Header({ title, tabs }: HeaderProps) {
  const dispatch = useAppDispatch()
  const { data: user } = userApi.useGetUserMeQuery()
  const [logout] = userApi.useLogoutMutation()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-base font-semibold">{title}</span>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {user?.email ? user.email.charAt(0).toUpperCase() : <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => dispatch(openDialog({ id: DIALOG_IDS.joinTeam }))}>
                <UserPlus />
                Join team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => void logout()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {tabs && tabs.length > 0 ? (
        <nav className="flex w-full items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex h-9 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'border-primary text-foreground',
                )
              }
            >
              <tab.icon className="size-4 shrink-0" />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
