import { describe, expect, it } from "vitest";

import { isMastered } from "./progress.ts";

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
