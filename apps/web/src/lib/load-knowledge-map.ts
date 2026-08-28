import path from "node:path";

import { loadCurriculum } from "@plp/content";
import type { KnowledgeNodeMetadata } from "@plp/domain";
import { layoutCurriculum, validateCurriculum, type CurriculumLayout } from "@plp/graph";

const contentRoot = path.join(process.cwd(), "../../content");

type KnowledgeMapData = {
  layout: CurriculumLayout;
  nodes: KnowledgeNodeMetadata[];
};

export async function loadKnowledgeMap(): Promise<KnowledgeMapData> {
  const nodes = await loadCurriculum(contentRoot);
  const issues = validateCurriculum({ nodes });

  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.code}: ${issue.message}`).join("\n");
    throw new Error(`Curriculum is invalid:\n${details}`);
  }

  const layout = await layoutCurriculum(nodes);
  return { layout, nodes };
}
