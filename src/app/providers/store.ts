import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import '@/entities'
import dialogReducer from '@/app/dialog/slice'
import authReducer from '@/entities/user/auth-slice'
import { rootApi } from './root-api'

export const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    auth: authReducer,
    dialog: dialogReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
