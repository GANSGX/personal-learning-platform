import { describe, expect, it } from "vitest";

import {
  graphViewModeSchema,
  knowledgeNodeMetadataSchema,
  labSchema,
  nodeTrackSchema,
  progressSchema,
  resolveNodeTrack,
} from "./schemas.ts";

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
    expect(parsed.titleEn).toBeUndefined();
  });

  it("accepts an optional English title", () => {
    const parsed = knowledgeNodeMetadataSchema.parse({
      id: "networking.tcp",
      title: "TCP",
      titleEn: "TCP",
      level: "foundation",
    });

    expect(parsed.titleEn).toBe("TCP");
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
  it("accepts track display modes and foundation/full", () => {
    expect(graphViewModeSchema.parse("networking")).toBe("networking");
    expect(graphViewModeSchema.parse("os")).toBe("os");
    expect(graphViewModeSchema.parse("linux")).toBe("linux");
    expect(graphViewModeSchema.parse("windows")).toBe("windows");
    expect(graphViewModeSchema.parse("infrastructure")).toBe("infrastructure");
    expect(graphViewModeSchema.parse("security")).toBe("security");
    expect(graphViewModeSchema.parse("osint")).toBe("osint");
    expect(graphViewModeSchema.parse("foundation")).toBe("foundation");
    expect(graphViewModeSchema.parse("full")).toBe("full");
    expect(graphViewModeSchema.parse("my-path")).toBe("my-path");
  });
});

describe("resolveNodeTrack", () => {
  it("resolves correct track for each prefix", () => {
    expect(resolveNodeTrack("networking.network-basics")).toBe("networking");
    expect(resolveNodeTrack("netadv.bgp")).toBe("networking");
    expect(resolveNodeTrack("web.http-protocol-internals")).toBe("networking");
    expect(resolveNodeTrack("os.hardware-architecture")).toBe("os");
    expect(resolveNodeTrack("linux.fhs")).toBe("linux");
    expect(resolveNodeTrack("automation.bash-scripting")).toBe("linux");
    expect(resolveNodeTrack("windows.architecture-and-internals")).toBe("windows");
    expect(resolveNodeTrack("devops.cicd-pipelines")).toBe("infrastructure");
    expect(resolveNodeTrack("security.principles")).toBe("security");
    expect(resolveNodeTrack("osint.sources-and-search")).toBe("osint");
    expect(resolveNodeTrack("unknown.node")).toBe("networking");
  });
});

describe("progressSchema", () => {
  it("accepts per-node completion records", () => {
    const parsed = progressSchema.parse({
      userId: "local",
      nodes: {
        "networking.tcp": {
          started: true,
          theoryComplete: true,
          practiceComplete: false,
          checkpointComplete: false,
        },
      },
    });

    expect(parsed.nodes["networking.tcp"]?.theoryComplete).toBe(true);
  });
});

describe("labSchema", () => {
  it("parses valid lab metadata with defaults", () => {
    const parsed = labSchema.parse({
      id: "pt-pc-pc",
      title: "Прямое соединение двух ПК",
      goal: "Проверить связность кабелем витой пары",
    });

    expect(parsed.environment).toBe("Cisco Packet Tracer");
    expect(parsed.checklist).toEqual([]);
    expect(parsed.titleEn).toBeUndefined();
  });

  it("parses full lab metadata with topology and checklist", () => {
    const parsed = labSchema.parse({
      id: "pt-switch-pc",
      title: "Сеть на коммутаторе",
      titleEn: "Switch LAN",
      environment: "Cisco Packet Tracer",
      goal: "Собрать топологию 'звезда'",
      topology: "[PC0] -- [Switch] -- [PC1]",
      checklist: ["Создать проект", "Соединить кабели", "Задать IP"],
    });

    expect(parsed.checklist).toHaveLength(3);
    expect(parsed.titleEn).toBe("Switch LAN");
  });
});

describe("nodeTrackSchema", () => {
  it("parses valid track identifiers", () => {
    expect(nodeTrackSchema.parse("networking")).toBe("networking");
    expect(nodeTrackSchema.parse("windows")).toBe("windows");
    expect(nodeTrackSchema.parse("linux")).toBe("linux");
  });
});
