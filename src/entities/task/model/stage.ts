export type StageType = 'OPEN' | 'MIDDLE' | 'END'

export interface StageSchema {
  id: number
  type: StageType
  name: string
  position: number
}

export interface StageTransition {
  from: number
  to: number
}

export interface StageConfig {
  team_id: number
  stages: StageSchema[]
  transitions: StageTransition[]
}
