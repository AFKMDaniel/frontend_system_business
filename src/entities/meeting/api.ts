import { rootApi } from '@/app/providers/root-api'
import { API_ENDPOINTS } from '@/shared/config'

import type {
  MeetingCreateSchema,
  MeetingListParams,
  MeetingOutSchema,
  MeetingUpdateSchema,
} from './types'

export const meetingApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<MeetingOutSchema[], { teamId: number; params?: MeetingListParams }>({
      query: ({ teamId, params }) => ({
        url: API_ENDPOINTS.teams.meetings(teamId),
        params,
      }),
      providesTags: ['Meeting'],
    }),
    getMeetingById: builder.query<MeetingOutSchema, { teamId: number; meetingId: number }>({
      query: ({ teamId, meetingId }) => API_ENDPOINTS.teams.meeting(teamId, meetingId),
      providesTags: ['Meeting'],
    }),
    createMeeting: builder.mutation<
      MeetingOutSchema,
      { teamId: number; body: MeetingCreateSchema }
    >({
      query: ({ teamId, body }) => ({
        url: API_ENDPOINTS.teams.meetings(teamId),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Meeting'],
    }),
    updateMeeting: builder.mutation<
      MeetingOutSchema,
      { teamId: number; meetingId: number; body: MeetingUpdateSchema }
    >({
      query: ({ teamId, meetingId, body }) => ({
        url: API_ENDPOINTS.teams.meeting(teamId, meetingId),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Meeting'],
    }),
    deleteMeeting: builder.mutation<void, { teamId: number; meetingId: number }>({
      query: ({ teamId, meetingId }) => ({
        url: API_ENDPOINTS.teams.meeting(teamId, meetingId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Meeting'],
    }),
    removeMeetingParticipants: builder.mutation<
      void,
      { teamId: number; meetingId: number; body: number[] }
    >({
      query: ({ teamId, meetingId, body }) => ({
        url: API_ENDPOINTS.teams.meetingParticipants(teamId, meetingId),
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Meeting'],
    }),
  }),
})
