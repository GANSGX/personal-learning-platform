import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import { filterNodesByView, isGraphViewActive, layoutCurriculumForView } from "./view.ts";

const foundationNode = knowledgeNodeMetadataSchema.parse({
  id: "fixture.alpha",
  title: "Fixture Alpha",
  level: "foundation",
});

const infrastructureNode = knowledgeNodeMetadataSchema.parse({
  id: "infra.sample",
  title: "Infrastructure Sample",
  level: "infrastructure",
});

describe("filterNodesByView", () => {
  it("keeps only foundation nodes in Foundation view", () => {
    expect(filterNodesByView([foundationNode, infrastructureNode], "foundation")).toEqual([
      foundationNode,
    ]);
  });

  it("returns all nodes in Full view", () => {
    expect(filterNodesByView([foundationNode, infrastructureNode], "full")).toEqual([
      foundationNode,
      infrastructureNode,
    ]);
  });

  it("returns no nodes for My Path stub view", () => {
    expect(filterNodesByView([foundationNode, infrastructureNode], "my-path")).toEqual([]);
  });
});

describe("layoutCurriculumForView", () => {
  it("layouts only the nodes visible in the selected view", async () => {
    const layout = await layoutCurriculumForView(
      [foundationNode, infrastructureNode],
      "foundation",
    );

    expect(layout.nodes.map((node) => node.id)).toEqual(["fixture.alpha"]);
    expect(layout.edges).toEqual([]);
  });
});

describe("isGraphViewActive", () => {
  it("enables Foundation only", () => {
    expect(isGraphViewActive("foundation")).toBe(true);
    expect(isGraphViewActive("infrastructure")).toBe(false);
    expect(isGraphViewActive("full")).toBe(false);
    expect(isGraphViewActive("my-path")).toBe(false);
  });
});
