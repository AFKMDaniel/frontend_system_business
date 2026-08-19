// TODO: once the ExecutorInfo TODO (backend returns executor email in the task
// response) is completed, this normalization can be dropped:
// - delete this file (teamMemberAdapter, selectAllMembers, selectMemberByUserId)
// - getTeamMembers returns a plain TeamMemberResponseSchema[]
// - task-board/index.tsx uses the raw array directly

import { createEntityAdapter } from '@reduxjs/toolkit'

import type { TeamMemberResponseSchema } from '../types'

export const teamMemberAdapter = createEntityAdapter<TeamMemberResponseSchema, number>({
  selectId: (member) => member.user.id,
})

export const { selectAll: selectAllMembers, selectById: selectMemberByUserId } =
  teamMemberAdapter.getSelectors()
