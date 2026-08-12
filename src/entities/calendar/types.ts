export interface CalendarEventSchema {
  id: number
  type: 'task' | 'meeting'
  title: string
  start: string
  end: string | null
}

export interface CalendarDaySchema {
  date: string
  events: CalendarEventSchema[]
}

export interface CalendarParams {
  team_id?: number
  start_date?: string
  end_date?: string
}
