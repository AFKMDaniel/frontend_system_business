export interface MeetingParticipantOutSchema {
  user_id: number
}

export interface MeetingOutSchema {
  id: number
  team_id: number
  creator_id: number
  title: string
  description: string
  start_time: string
  end_time: string
  created_at: string
  participants: MeetingParticipantOutSchema[]
}

export interface MeetingCreateSchema {
  title: string
  description: string
  start_time: string
  end_time: string
  participants?: number[]
}

export interface MeetingUpdateSchema {
  title?: string | null
  description?: string | null
  start_time?: string | null
  end_time?: string | null
  participants?: number[] | null
}

export interface MeetingListParams {
  only_my?: boolean
  executor_user_id?: number
  start_date?: string
  end_date?: string
}
