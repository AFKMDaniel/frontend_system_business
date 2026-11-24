import type { StageConfig } from './stage'

export type StageTransitionAccess = {
  isPrivileged: boolean
  isExecutor: boolean
  /** Whether the task currently has an assigned executor. */
  hasExecutor: boolean
}

/**
 * Resolves the stages a task may move to, mirroring the backend rules:
 * - only transitions configured for the team are allowed;
 * - executors cannot leave or enter the END stage;
 * - OPEN -> MIDDLE requires an assigned executor.
 */
export function getAllowedStageIds(
  currentStageId: number,
  config: Pick<StageConfig, 'stages' | 'transitions'>,
  access: StageTransitionAccess,
): number[] {
  if (!access.isPrivileged && !access.isExecutor) {
    return []
  }

  const stagesById = new Map(config.stages.map((stage) => [stage.id, stage]))
  const currentStage = stagesById.get(currentStageId)

  if (!access.isPrivileged && currentStage?.type === 'END') {
    return []
  }

  return config.transitions
    .filter((transition) => transition.from === currentStageId)
    .filter((transition) => {
      const targetStage = stagesById.get(transition.to)

      if (!access.isPrivileged && targetStage?.type === 'END') {
        return false
      }

      if (
        currentStage?.type === 'OPEN' &&
        targetStage?.type === 'MIDDLE' &&
        !access.hasExecutor
      ) {
        return false
      }

      return true
    })
    .map((transition) => transition.to)
}
