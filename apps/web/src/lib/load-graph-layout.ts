import path from "node:path";

import { loadCurriculum } from "@plp/content";
import { layoutCurriculum, validateCurriculum, type CurriculumLayout } from "@plp/graph";

const contentRoot = path.join(process.cwd(), "../../content");

export async function loadGraphLayout(): Promise<CurriculumLayout> {
  const nodes = await loadCurriculum(contentRoot);
  const issues = validateCurriculum({ nodes });

  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.code}: ${issue.message}`).join("\n");
    throw new Error(`Curriculum is invalid:\n${details}`);
  }

  return layoutCurriculum(nodes);
}
