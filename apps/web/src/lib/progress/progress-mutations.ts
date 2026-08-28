import type { NodeProgressRecord, Progress } from "@plp/domain";
import { createEmptyNodeProgress, nodeProgressRecordSchema, progressSchema } from "@plp/domain";

function mergeNodeProgress(
  progress: Progress,
  nodeId: string,
  update: Partial<NodeProgressRecord>,
): Progress {
  const current = progress.nodes[nodeId] ?? createEmptyNodeProgress();
  const nextRecord = nodeProgressRecordSchema.parse({ ...current, ...update });

  return progressSchema.parse({
    userId: progress.userId,
    nodes: {
      ...progress.nodes,
      [nodeId]: nextRecord,
    },
  });
}

export function markNodeStarted(progress: Progress, nodeId: string): Progress {
  return mergeNodeProgress(progress, nodeId, { started: true });
}

export function markTheoryComplete(progress: Progress, nodeId: string): Progress {
  return mergeNodeProgress(progress, nodeId, {
    started: true,
    theoryComplete: true,
  });
}

export function markPracticeComplete(progress: Progress, nodeId: string): Progress {
  const current = progress.nodes[nodeId] ?? createEmptyNodeProgress();

  if (!current.theoryComplete) {
    throw new Error("Theory must be complete before practice");
  }

  return mergeNodeProgress(progress, nodeId, {
    started: true,
    practiceComplete: true,
  });
}

export function markCheckpointComplete(progress: Progress, nodeId: string): Progress {
  const current = progress.nodes[nodeId] ?? createEmptyNodeProgress();

  if (!current.practiceComplete) {
    throw new Error("Practice must be complete before checkpoint");
  }

  return mergeNodeProgress(progress, nodeId, {
    started: true,
    checkpointComplete: true,
  });
}
