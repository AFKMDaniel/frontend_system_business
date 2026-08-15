import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/app/providers/store'
import { refreshToken } from '@/entities/user/auth-thunks'
import { selectAccessToken, selectAuthStatus } from '@/entities/user/auth-slice'
import { ROUTES } from '@/shared/config'

export function AuthProvider() {
  const token = useAppSelector(selectAccessToken)
  const status = useAppSelector(selectAuthStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(refreshToken())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (status === 'ready' && !token) {
      navigate(ROUTES.login, { replace: true })
    }
  }, [status, token, navigate])

  return null
}
