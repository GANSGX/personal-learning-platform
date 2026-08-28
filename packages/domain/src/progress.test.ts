import { describe, expect, it } from "vitest";

import {
  createEmptyNodeProgress,
  deriveNodeStatusFromFlags,
  isMastered,
  parseNodeProgressRecord,
} from "./progress.ts";

describe("isMastered", () => {
  it("requires theory, practice and checkpoint", () => {
    expect(
      isMastered({
        theoryComplete: true,
        practiceComplete: true,
        checkpointComplete: true,
      }),
    ).toBe(true);
  });

  it("rejects incomplete combinations", () => {
    expect(
      isMastered({
        theoryComplete: true,
        practiceComplete: true,
        checkpointComplete: false,
      }),
    ).toBe(false);
  });
});

describe("deriveNodeStatusFromFlags", () => {
  it("maps completion flags to node statuses", () => {
    expect(deriveNodeStatusFromFlags(createEmptyNodeProgress())).toBe("AVAILABLE");
    expect(
      deriveNodeStatusFromFlags({
        started: true,
        theoryComplete: false,
        practiceComplete: false,
        checkpointComplete: false,
      }),
    ).toBe("IN_PROGRESS");
    expect(
      deriveNodeStatusFromFlags({
        started: true,
        theoryComplete: true,
        practiceComplete: false,
        checkpointComplete: false,
      }),
    ).toBe("THEORY_COMPLETE");
    expect(
      deriveNodeStatusFromFlags({
        started: true,
        theoryComplete: true,
        practiceComplete: true,
        checkpointComplete: false,
      }),
    ).toBe("PRACTICE_COMPLETE");
    expect(
      deriveNodeStatusFromFlags({
        started: true,
        theoryComplete: true,
        practiceComplete: true,
        checkpointComplete: true,
      }),
    ).toBe("MASTERED");
  });
});

describe("parseNodeProgressRecord", () => {
  it("applies defaults for partial records", () => {
    expect(parseNodeProgressRecord({ theoryComplete: true })).toEqual({
      started: false,
      theoryComplete: true,
      practiceComplete: false,
      checkpointComplete: false,
    });
  });
});
