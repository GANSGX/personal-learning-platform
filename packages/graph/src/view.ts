import type { GraphViewMode, KnowledgeNodeMetadata } from "@plp/domain";

import { layoutCurriculum, type CurriculumLayout } from "./layout.ts";

const levelViews = [
  "foundation",
  "infrastructure",
  "security",
  "osint",
] as const satisfies readonly GraphViewMode[];

function isLevelView(view: GraphViewMode): view is (typeof levelViews)[number] {
  return levelViews.includes(view as (typeof levelViews)[number]);
}

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

  if (isLevelView(view)) {
    return nodes.filter((node) => node.level === view);
  }

  return [];
}

export async function layoutCurriculumForView(
  nodes: readonly KnowledgeNodeMetadata[],
  view: GraphViewMode,
): Promise<CurriculumLayout> {
  return layoutCurriculum(filterNodesByView(nodes, view));
}

export function isGraphViewActive(view: GraphViewMode): view is "foundation" {
  return view === "foundation";
}
