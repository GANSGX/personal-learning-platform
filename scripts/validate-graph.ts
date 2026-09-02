import path from "node:path";
import process from "node:process";

import { collectLabIds, loadCurriculum } from "@plp/content";
import { validateCurriculum } from "@plp/graph";
import { VISUALIZATION_IDS } from "@plp/visualizations/registry-ids";

const contentRoot = path.resolve(process.cwd(), "content");
const labsRoot = path.resolve(process.cwd(), "labs");

const nodes = await loadCurriculum(contentRoot);
const labIds = collectLabIds(labsRoot);

const issues = validateCurriculum({
  nodes,
  visualizationIds: VISUALIZATION_IDS,
  labIds,
});

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.code}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Graph valid: ${String(nodes.length)} nodes, ${String(labIds.size)} labs`);
}
