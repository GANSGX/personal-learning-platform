import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import { filterNodesByView, isGraphViewActive, layoutCurriculumForView } from "./view.ts";

const networkingNode = knowledgeNodeMetadataSchema.parse({
  id: "networking.network-basics",
  title: "Computer Networks",
  level: "foundation",
});

const windowsNode = knowledgeNodeMetadataSchema.parse({
  id: "windows.architecture-and-internals",
  title: "Windows Architecture",
  level: "foundation",
});

const infrastructureNode = knowledgeNodeMetadataSchema.parse({
  id: "infra.sample",
  title: "Infrastructure Sample",
  level: "infrastructure",
});

describe("filterNodesByView", () => {
  it("keeps only networking nodes in networking view", () => {
    expect(
      filterNodesByView([networkingNode, windowsNode, infrastructureNode], "networking"),
    ).toEqual([networkingNode]);
  });

  it("keeps only windows nodes in windows view", () => {
    expect(filterNodesByView([networkingNode, windowsNode, infrastructureNode], "windows")).toEqual(
      [windowsNode],
    );
  });

  it("filters os, linux, security, osint, and foundation correctly", () => {
    const osNode = knowledgeNodeMetadataSchema.parse({
      id: "os.kernel",
      title: "Kernel",
      level: "foundation",
    });
    const linuxNode = knowledgeNodeMetadataSchema.parse({
      id: "linux.bash",
      title: "Bash",
      level: "foundation",
    });
    const secNode = knowledgeNodeMetadataSchema.parse({
      id: "security.iam",
      title: "IAM",
      level: "security",
    });
    const osintNode = knowledgeNodeMetadataSchema.parse({
      id: "osint.recon",
      title: "Recon",
      level: "osint",
    });

    const all = [
      networkingNode,
      windowsNode,
      infrastructureNode,
      osNode,
      linuxNode,
      secNode,
      osintNode,
    ];

    expect(filterNodesByView(all, "os")).toEqual([osNode]);
    expect(filterNodesByView(all, "linux")).toEqual([linuxNode]);
    expect(filterNodesByView(all, "infrastructure")).toEqual([infrastructureNode]);
    expect(filterNodesByView(all, "security")).toEqual([secNode]);
    expect(filterNodesByView(all, "osint")).toEqual([osintNode]);
    expect(filterNodesByView(all, "foundation")).toEqual([
      networkingNode,
      windowsNode,
      osNode,
      linuxNode,
    ]);
  });

  it("returns all nodes in Full view", () => {
    expect(filterNodesByView([networkingNode, windowsNode, infrastructureNode], "full")).toEqual([
      networkingNode,
      windowsNode,
      infrastructureNode,
    ]);
  });

  it("returns no nodes for My Path stub view", () => {
    expect(filterNodesByView([networkingNode, infrastructureNode], "my-path")).toEqual([]);
  });
});

describe("layoutCurriculumForView", () => {
  it("layouts only the nodes visible in the selected view", async () => {
    const layout = await layoutCurriculumForView(
      [networkingNode, infrastructureNode],
      "networking",
    );

    expect(layout.nodes.map((node) => node.id)).toEqual(["networking.network-basics"]);
    expect(layout.edges).toEqual([]);
  });
});

describe("isGraphViewActive", () => {
  it("enables all real views except my-path", () => {
    expect(isGraphViewActive("networking")).toBe(true);
    expect(isGraphViewActive("windows")).toBe(true);
    expect(isGraphViewActive("infrastructure")).toBe(true);
    expect(isGraphViewActive("full")).toBe(true);
    expect(isGraphViewActive("my-path")).toBe(false);
  });
});
