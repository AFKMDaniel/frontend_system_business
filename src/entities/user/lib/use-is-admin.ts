import { APP_ROLES } from '../types'
import { userApi } from '../api'

export function useIsAdmin(): boolean {
  const { data: user } = userApi.useGetUserMeQuery()
  return user?.roles.some((role) => role.name === APP_ROLES.admin) ?? false
}
