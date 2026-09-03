import { describe, expect, it } from "vitest";

import { getContentRoot } from "./content-root.ts";

describe("getContentRoot", () => {
  it("resolves to content directory path", () => {
    const p = getContentRoot();
    expect(p).toContain("content");
  });
});
