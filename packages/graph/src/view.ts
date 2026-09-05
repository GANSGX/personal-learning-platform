import type { GraphViewMode, KnowledgeNodeMetadata } from "@plp/domain";

import { layoutCurriculum, type CurriculumLayout } from "./layout.ts";

export function filterNodesByView(
  nodes: readonly KnowledgeNodeMetadata[],
  view: GraphViewMode,
): KnowledgeNodeMetadata[] {
  if (view === "full") {
    return [...nodes];
  }

  if (view === "my-path") {
    return [];
  }

  if (view === "networking") {
    return nodes.filter(
      (node) =>
        node.id.startsWith("networking.") ||
        node.id.startsWith("netadv.") ||
        node.id.startsWith("web."),
    );
  }

  if (view === "os") {
    return nodes.filter((node) => node.id.startsWith("os."));
  }

  if (view === "linux") {
    return nodes.filter(
      (node) => node.id.startsWith("linux.") || node.id.startsWith("automation."),
    );
  }

  if (view === "windows") {
    return nodes.filter((node) => node.id.startsWith("windows."));
  }

  if (view === "infrastructure") {
    return nodes.filter(
      (node) =>
        node.level === "infrastructure" ||
        node.id.startsWith("devops.") ||
        node.id.startsWith("containers.") ||
        node.id.startsWith("infra."),
    );
  }

  if (view === "security") {
    return nodes.filter(
      (node) =>
        node.level === "security" ||
        node.id.startsWith("security.") ||
        node.id.startsWith("crypto."),
    );
  }

  if (view === "osint") {
    return nodes.filter((node) => node.level === "osint" || node.id.startsWith("osint."));
  }

  return nodes.filter((node) => node.level === "foundation");
}

export async function layoutCurriculumForView(
  nodes: readonly KnowledgeNodeMetadata[],
  view: GraphViewMode,
): Promise<CurriculumLayout> {
  return layoutCurriculum(filterNodesByView(nodes, view));
}

export function isGraphViewActive(view: GraphViewMode): boolean {
  return view !== "my-path";
}
