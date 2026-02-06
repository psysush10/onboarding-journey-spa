import { JourneyStage } from "../data/journey"; 

export function getEligibleStages(stages: JourneyStage[]) {
  const completedStageIds = new Set(
    stages.filter(s => s.completedAt).map(s => s.id)
  );

  return stages
    .filter(stage => {
      if (stage.completedAt) return false;
      if (!stage.dependsOn || stage.dependsOn.length === 0) return true;
      return stage.dependsOn.every(id => completedStageIds.has(id));
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

