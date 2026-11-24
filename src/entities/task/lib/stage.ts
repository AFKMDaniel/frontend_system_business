import type { StageSchema } from '../model/stage'

export function sortStagesByPosition(stages: StageSchema[]): StageSchema[] {
  return [...stages].sort((a, b) => a.position - b.position)
}
