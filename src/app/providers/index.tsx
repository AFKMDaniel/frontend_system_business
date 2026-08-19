import type { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'

import { DialogHost } from '@/app/dialog/ui/dialog-host'
import { Toaster } from '@/shared/ui/sonner'

import { AuthProvider } from './auth-provider'
import { store } from './store'

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider />
        {children}
        <DialogHost />
        <Toaster />
      </ThemeProvider>
    </Provider>
  )
}
