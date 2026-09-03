import { describe, expect, it } from "vitest";

import { getKnowledgeMapArtifactPath } from "./knowledge-map-artifact-path.ts";

describe("getKnowledgeMapArtifactPath", () => {
  it("resolves to .cache/knowledge-map.json path", () => {
    const p = getKnowledgeMapArtifactPath();
    expect(p).toContain(".cache/knowledge-map.json");
  });
});
