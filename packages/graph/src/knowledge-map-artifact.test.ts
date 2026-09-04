import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import { parseKnowledgeMapArtifact } from "./knowledge-map-artifact.ts";

const alpha = knowledgeNodeMetadataSchema.parse({
  id: "fixture.alpha",
  title: "Fixture Alpha",
  level: "foundation",
});

describe("parseKnowledgeMapArtifact", () => {
  it("accepts a generated knowledge map artifact", () => {
    const parsed = parseKnowledgeMapArtifact({
      contentHash: "abc123",
      generatedAt: "2026-08-28T12:00:00.000Z",
      nodes: [alpha],
      layout: {
        nodes: [
          {
            id: "fixture.alpha",
            title: "Fixture Alpha",
            level: "foundation",
            x: 0,
            y: 0,
            width: 180,
            height: 56,
          },
        ],
        edges: [],
      },
    });

    expect(parsed.nodes).toHaveLength(1);
    expect(parsed.labs).toEqual({});
    expect(parsed.layout.nodes[0]?.id).toBe("fixture.alpha");
  });

  it("accepts artifact with populated labs dictionary", () => {
    const parsed = parseKnowledgeMapArtifact({
      contentHash: "abc123",
      generatedAt: "2026-08-28T12:00:00.000Z",
      nodes: [alpha],
      labs: {
        "pt-pc-pc": {
          id: "pt-pc-pc",
          title: "Прямое соединение двух ПК",
          goal: "Проверить связность",
          environment: "Cisco Packet Tracer",
          checklist: ["Шаг 1"],
        },
      },
      layout: {
        nodes: [
          {
            id: "fixture.alpha",
            title: "Fixture Alpha",
            level: "foundation",
            x: 0,
            y: 0,
            width: 180,
            height: 56,
          },
        ],
        edges: [],
      },
    });

    expect(parsed.labs["pt-pc-pc"]?.title).toBe("Прямое соединение двух ПК");
  });

  it("rejects malformed artifacts", () => {
    expect(() => parseKnowledgeMapArtifact({ nodes: [] })).toThrow();
  });
});
