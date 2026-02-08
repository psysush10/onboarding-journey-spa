import { JourneyStage } from "../data/journey"; 

export function getEligibleStages(stages: JourneyStage[]) {
  const completedStageIds = new Set(
    stages.filter(s => s.completedAt).map(s => s.id)
  );

  return stages
    .filter(stage => {
      if (stage.completedAt) return false;
      if (!stage.dependsOn || stage.dependsOn.length === 0) return true;
      // 3. All dependencies must be completed
      return stage.dependsOn.every(depStageId => {
        const dependency = stages.find(s => s.id === depStageId);

        // If dependency is optional, it should NOT block
        if (dependency?.optional) return true;

        // Otherwise it must be completed
        return completedStageIds.has(depStageId);
      });
    })
    .sort((a, b) => a.order - b.order);
}

export function completeStage(
  stages: JourneyStage[],
  stageId: string,
  completedAt = new Date().toISOString()
): JourneyStage[] {
  return stages.map(stage =>
    stage.id === stageId
      ? { ...stage, completedAt }
      : stage
  );
}

export function isJourneyCompleted(stages: JourneyStage[]) {
  return stages.every(stage => stage.completedAt);
}

