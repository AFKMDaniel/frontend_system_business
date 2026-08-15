import { userApi } from '../api'

export function useIsAdmin(): boolean {
  const { data: user } = userApi.useGetUserMeQuery()
  return user?.roles.some((role) => role.name === 'admin') ?? false
}
