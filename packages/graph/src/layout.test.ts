import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import { layoutCurriculum, readElkPositions, requiresEdges, toLayoutNodes } from "./layout.ts";

const alpha = knowledgeNodeMetadataSchema.parse({
  id: "fixture.alpha",
  title: "Fixture Alpha",
  level: "foundation",
});

const beta = knowledgeNodeMetadataSchema.parse({
  id: "fixture.beta",
  title: "Fixture Beta",
  level: "foundation",
  requires: ["fixture.alpha"],
});

describe("requiresEdges", () => {
  it("points from the prerequisite to the dependent node", () => {
    expect(requiresEdges([alpha, beta])).toEqual([
      { id: "fixture.alpha->fixture.beta", source: "fixture.alpha", target: "fixture.beta" },
    ]);
  });
});

describe("layoutCurriculum", () => {
  it("returns an empty layout for zero nodes", async () => {
    await expect(layoutCurriculum([])).resolves.toEqual({ nodes: [], edges: [] });
  });

  it("defaults missing ELK coordinates and skips nameless children", () => {
    const positions = readElkPositions([
      { id: "fixture.alpha" },
      { id: "fixture.beta", x: 12, y: 8 },
      { y: 3 },
    ]);

    expect(positions.get("fixture.alpha")).toEqual({ x: 0, y: 0 });
    expect(positions.get("fixture.beta")).toEqual({ x: 12, y: 8 });
    expect(positions.size).toBe(2);
    expect(readElkPositions().size).toBe(0);
  });

  it("places a node at origin when ELK omitted its id", () => {
    const [laidOut] = toLayoutNodes([alpha], new Map());
    expect(laidOut).toMatchObject({ id: "fixture.alpha", x: 0, y: 0, width: 260, height: 92 });
  });

  it("places requires edges left-to-right with coordinates", async () => {
    const layout = await layoutCurriculum([alpha, beta]);

    expect(layout.edges).toHaveLength(1);
    expect(layout.nodes).toHaveLength(2);

    const alphaNode = layout.nodes.find((node) => node.id === "fixture.alpha");
    const betaNode = layout.nodes.find((node) => node.id === "fixture.beta");

    expect(alphaNode).toMatchObject({
      title: "Fixture Alpha",
      level: "foundation",
      width: 260,
      height: 92,
    });
    expect(betaNode).toMatchObject({ title: "Fixture Beta", width: 260, height: 92 });
    expect(alphaNode?.x).toBeTypeOf("number");
    expect(betaNode?.x).toBeTypeOf("number");
    expect((betaNode?.x ?? 0) >= (alphaNode?.x ?? 0)).toBe(true);
  });
});
