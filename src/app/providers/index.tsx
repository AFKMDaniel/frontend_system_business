import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { DialogHost } from '@/app/dialog/ui/dialog-host'
import { Toaster } from '@/shared/ui/sonner'

import { AuthProvider } from './auth-provider'
import { store } from './store'

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthProvider />
      {children}
      <DialogHost />
      <Toaster />
    </Provider>
  )
}
