import { loadCurriculum } from "@plp/content";
import type { KnowledgeNodeMetadata } from "@plp/domain";
import { layoutCurriculum, validateCurriculum, type CurriculumLayout } from "@plp/graph";

import { getContentRoot } from "./content-root";

type KnowledgeMapData = {
  layout: CurriculumLayout;
  nodes: KnowledgeNodeMetadata[];
};

export async function loadKnowledgeMap(): Promise<KnowledgeMapData> {
  const nodes = await loadCurriculum(getContentRoot());
  const issues = validateCurriculum({ nodes });

  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.code}: ${issue.message}`).join("\n");
    throw new Error(`Curriculum is invalid:\n${details}`);
  }

  const layout = await layoutCurriculum(nodes);
  return { layout, nodes };
}
