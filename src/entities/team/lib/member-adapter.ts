import { createEntityAdapter } from '@reduxjs/toolkit'

import type { TeamMemberResponseSchema } from '../types'

export const teamMemberAdapter = createEntityAdapter<
  TeamMemberResponseSchema,
  number
>({
  selectId: (member) => member.user.id,
})

export const {
  selectAll: selectAllMembers,
  selectById: selectMemberByUserId,
} = teamMemberAdapter.getSelectors()
