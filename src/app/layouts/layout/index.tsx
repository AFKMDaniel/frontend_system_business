import type { PropsWithChildren } from 'react'

import { cn } from '@/shared/lib/utils'

import { Header, type HeaderTab } from './header'

type LayoutProps = PropsWithChildren<{
  title: string
  tabs?: HeaderTab[]
  fullWidth?: boolean
}>

export function Layout({ title, tabs, children, fullWidth }: LayoutProps) {
  return (
    <div className={cn(fullWidth ? 'flex h-dvh flex-col overflow-hidden' : 'min-h-dvh')}>
      <Header title={title} tabs={tabs} />
      <main
        className={cn(
          'mx-auto w-full px-4 py-8',
          fullWidth ? 'flex min-h-0 max-w-none flex-1 flex-col' : 'max-w-6xl',
        )}
      >
        {children}
      </main>
    </div>
  )
}
