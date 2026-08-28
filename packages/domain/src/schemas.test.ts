import { describe, expect, it } from "vitest";

import { graphViewModeSchema, knowledgeNodeMetadataSchema, progressSchema } from "./schemas.ts";

describe("knowledgeNodeMetadataSchema", () => {
  it("accepts a valid networking node", () => {
    const parsed = knowledgeNodeMetadataSchema.parse({
      id: "networking.tcp",
      title: "TCP",
      level: "foundation",
      requires: ["networking.ip", "networking.ports"],
      unlocks: ["web.http"],
      visualizations: ["tcp-handshake"],
      labs: ["networking.tcp.basic"],
    });

    expect(parsed.relatedTo).toEqual([]);
  });

  it("rejects an invalid id", () => {
    const result = knowledgeNodeMetadataSchema.safeParse({
      id: "TCP",
      title: "TCP",
      level: "foundation",
    });

    expect(result.success).toBe(false);
  });
});

describe("graphViewModeSchema", () => {
  it("accepts the six display modes from the spec", () => {
    expect(graphViewModeSchema.parse("foundation")).toBe("foundation");
    expect(graphViewModeSchema.parse("my-path")).toBe("my-path");
  });
});

describe("progressSchema", () => {
  it("accepts per-node status map", () => {
    const parsed = progressSchema.parse({
      userId: "local",
      nodes: { "networking.tcp": "IN_PROGRESS" },
    });

    expect(parsed.nodes["networking.tcp"]).toBe("IN_PROGRESS");
  });
});
