import type { RootState } from '@/app/providers/store'

export async function fetchWithAuth(
  url: string,
  init: RequestInit,
  getState: () => RootState,
): Promise<Response> {
  const token = getState().auth.token
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}
