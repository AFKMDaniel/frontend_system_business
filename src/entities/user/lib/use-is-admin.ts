import { APP_ROLES } from '../model/user'
import { userApi } from '../api/user'

export function useIsAdmin(): boolean {
  const { data: user } = userApi.useGetUserMeQuery()
  return user?.roles.some((role) => role.name === APP_ROLES.admin) ?? false
}
