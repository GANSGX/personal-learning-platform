import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import { validateCurriculum } from "./validate.ts";

const tcp = knowledgeNodeMetadataSchema.parse({
  id: "networking.tcp",
  title: "TCP",
  level: "foundation",
  requires: ["web.http"],
});

const http = knowledgeNodeMetadataSchema.parse({
  id: "web.http",
  title: "HTTP",
  level: "foundation",
  requires: ["networking.tcp"],
});

const ip = knowledgeNodeMetadataSchema.parse({
  id: "networking.ip",
  title: "IP",
  level: "foundation",
});

describe("validateCurriculum", () => {
  it("detects a requires cycle", () => {
    const issues = validateCurriculum({ nodes: [tcp, http] });
    const cycle = issues.find((issue) => issue.code === "cycle");

    expect(cycle?.message).toContain("networking.tcp");
    expect(cycle?.message).toContain("web.http");
  });

  it("accepts a valid DAG", () => {
    const tcpAfterIp = knowledgeNodeMetadataSchema.parse({
      id: "networking.tcp",
      title: "TCP",
      level: "foundation",
      requires: ["networking.ip"],
    });

    expect(validateCurriculum({ nodes: [ip, tcpAfterIp] })).toEqual([]);
  });

  it("reports missing prerequisites and duplicate ids", () => {
    const issues = validateCurriculum({
      nodes: [
        tcp,
        knowledgeNodeMetadataSchema.parse({
          id: "networking.tcp",
          title: "TCP copy",
          level: "foundation",
        }),
      ],
    });

    expect(issues.some((issue) => issue.code === "duplicate-id")).toBe(true);
    expect(issues.some((issue) => issue.code === "missing-prerequisite")).toBe(true);
  });

  it("reports unknown visualization and lab ids when registries are provided", () => {
    const node = knowledgeNodeMetadataSchema.parse({
      id: "networking.tcp",
      title: "TCP",
      level: "foundation",
      visualizations: ["tcp-handshake"],
      labs: ["networking.tcp.basic"],
    });

    const issues = validateCurriculum({
      nodes: [node],
      visualizationIds: new Set(["packet-journey"]),
      labIds: new Set(["networking.arp.basic"]),
    });

    expect(issues.some((issue) => issue.code === "invalid-visualization")).toBe(true);
    expect(issues.some((issue) => issue.code === "invalid-lab")).toBe(true);
  });

  it("reports orphan lessons when tracks are provided", () => {
    const issues = validateCurriculum({
      nodes: [ip],
      tracks: [
        { id: "foundation.networking-i", title: "Networking I", nodeIds: ["networking.tcp"] },
      ],
    });

    expect(issues.some((issue) => issue.code === "orphan-lesson")).toBe(true);
    expect(issues.some((issue) => issue.code === "invalid-track-node")).toBe(true);
  });

  it("reports broken unlock and related-to references", () => {
    const node = knowledgeNodeMetadataSchema.parse({
      id: "networking.tcp",
      title: "TCP",
      level: "foundation",
      unlocks: ["web.http"],
      relatedTo: ["networking.udp"],
    });

    const issues = validateCurriculum({ nodes: [node] });

    expect(issues.some((issue) => issue.code === "broken-unlock")).toBe(true);
    expect(issues.some((issue) => issue.code === "broken-related")).toBe(true);
  });
});
