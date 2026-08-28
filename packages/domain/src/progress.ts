import type { NodeProgressRecord, NodeStatus } from "./schemas.ts";
import { nodeProgressRecordSchema } from "./schemas.ts";

export function isMastered(input: {
  theoryComplete: boolean;
  practiceComplete: boolean;
  checkpointComplete: boolean;
}): boolean {
  return input.theoryComplete && input.practiceComplete && input.checkpointComplete;
}

export function createEmptyNodeProgress(): NodeProgressRecord {
  return {
    started: false,
    theoryComplete: false,
    practiceComplete: false,
    checkpointComplete: false,
  };
}

export function deriveNodeStatusFromFlags(record: NodeProgressRecord): NodeStatus {
  if (
    isMastered({
      theoryComplete: record.theoryComplete,
      practiceComplete: record.practiceComplete,
      checkpointComplete: record.checkpointComplete,
    })
  ) {
    return "MASTERED";
  }

  if (record.practiceComplete) {
    return "PRACTICE_COMPLETE";
  }

  if (record.theoryComplete) {
    return "THEORY_COMPLETE";
  }

  if (record.started) {
    return "IN_PROGRESS";
  }

  return "AVAILABLE";
}

export function parseNodeProgressRecord(value: unknown): NodeProgressRecord {
  return nodeProgressRecordSchema.parse(value ?? {});
}
