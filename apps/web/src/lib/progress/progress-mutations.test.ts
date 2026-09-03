import { describe, expect, it } from "vitest";

import {
  markCheckpointComplete,
  markNodeStarted,
  markPracticeComplete,
  markTheoryComplete,
} from "./progress-mutations.ts";

describe("progress-mutations", () => {
  const baseProgress = { userId: "user-1", nodes: {} };

  it("marks node started", () => {
    const p1 = markNodeStarted(baseProgress, "node-1");
    expect(p1.nodes["node-1"]?.started).toBe(true);
  });

  it("marks theory complete", () => {
    const p2 = markTheoryComplete(baseProgress, "node-1");
    expect(p2.nodes["node-1"]?.theoryComplete).toBe(true);
    expect(p2.nodes["node-1"]?.started).toBe(true);
  });

  it("throws error if practice is marked before theory", () => {
    expect(() => markPracticeComplete(baseProgress, "node-1")).toThrow(
      "Theory must be complete before practice",
    );
  });

  it("marks practice complete when theory is complete", () => {
    const pWithTheory = markTheoryComplete(baseProgress, "node-1");
    const pWithPractice = markPracticeComplete(pWithTheory, "node-1");
    expect(pWithPractice.nodes["node-1"]?.practiceComplete).toBe(true);
  });

  it("throws error if checkpoint is marked before practice", () => {
    const pWithTheory = markTheoryComplete(baseProgress, "node-1");
    expect(() => markCheckpointComplete(pWithTheory, "node-1")).toThrow(
      "Practice must be complete before checkpoint",
    );
  });

  it("marks checkpoint complete when practice is complete", () => {
    const pWithTheory = markTheoryComplete(baseProgress, "node-1");
    const pWithPractice = markPracticeComplete(pWithTheory, "node-1");
    const pWithCheckpoint = markCheckpointComplete(pWithPractice, "node-1");
    expect(pWithCheckpoint.nodes["node-1"]?.checkpointComplete).toBe(true);
  });
});
