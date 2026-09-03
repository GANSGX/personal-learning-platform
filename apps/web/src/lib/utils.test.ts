import { describe, expect, it } from "vitest";

import { cn } from "./utils.ts";

describe("cn utility", () => {
  it("merges class names and resolves tailwind collisions", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", null, "")).toBe("text-red-500");
  });
});
