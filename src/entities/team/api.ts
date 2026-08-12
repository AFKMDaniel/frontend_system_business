import { rootApi } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/config'

import type {
  AddTeamMemberSchema,
  AdminTeamCreateSchema,
  OutAdminTeamCreateSchema,
  TeamMemberResponseSchema,
  TeamResponseSchema,
  UpdateTeamMemberRoleSchema,
} from './types'

export const teamApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query<TeamResponseSchema, { teamId: number }>({
      query: ({ teamId }) => API_ENDPOINTS.teams.get(teamId),
      providesTags: ['Team'],
    }),
    getTeamMembers: builder.query<TeamResponseSchema, { teamId: number }>({
      query: ({ teamId }) => API_ENDPOINTS.teams.members(teamId),
      providesTags: ['Team'],
    }),
    addTeamMember: builder.mutation<
      TeamMemberResponseSchema,
      { teamId: number; body: AddTeamMemberSchema }
    >({
      query: ({ teamId, body }) => ({
        url: API_ENDPOINTS.teams.members(teamId),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    updateMemberRole: builder.mutation<
      TeamMemberResponseSchema,
      { teamId: number; userId: number; body: UpdateTeamMemberRoleSchema }
    >({
      query: ({ teamId, userId, body }) => ({
        url: API_ENDPOINTS.teams.member(teamId, userId),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    removeMember: builder.mutation<void, { teamId: number; userId: number }>({
      query: ({ teamId, userId }) => ({
        url: API_ENDPOINTS.teams.member(teamId, userId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    adminCreateTeam: builder.mutation<OutAdminTeamCreateSchema, AdminTeamCreateSchema>({
      query: (body) => ({ url: API_ENDPOINTS.admin.createTeam, method: 'POST', body }),
      invalidatesTags: ['Team'],
    }),
  }),
})
