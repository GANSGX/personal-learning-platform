import { describe, expect, it } from "vitest";

import { getNodeStatusClassName } from "./node-status-styles.ts";

describe("getNodeStatusClassName", () => {
  it("returns styling class names for each NodeStatus", () => {
    expect(getNodeStatusClassName("LOCKED")).toContain("border-muted-foreground");
    expect(getNodeStatusClassName("AVAILABLE")).toContain("border-border");
    expect(getNodeStatusClassName("IN_PROGRESS")).toContain("border-sky-500");
    expect(getNodeStatusClassName("THEORY_COMPLETE")).toContain("border-amber-500");
    expect(getNodeStatusClassName("PRACTICE_COMPLETE")).toContain("border-orange-500");
    expect(getNodeStatusClassName("MASTERED")).toContain("border-emerald-500");
  });
});
