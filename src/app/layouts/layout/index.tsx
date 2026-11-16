import type { PropsWithChildren } from 'react'

import { Header, type HeaderTab } from './ui/header'

type LayoutProps = PropsWithChildren<{
  title: string
  tabs?: HeaderTab[]
}>

export function Layout({ title, tabs, children }: LayoutProps) {
  return (
    <div className="min-h-dvh">
      <Header title={title} tabs={tabs} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
