import path from "node:path";
import process from "node:process";

import { collectMdxFiles, loadCurriculum, validateContentLinks } from "@plp/content";
import { validateCurriculum } from "@plp/graph";
import { VISUALIZATION_IDS } from "@plp/visualizations/registry-ids";

const contentRoot = path.resolve(process.cwd(), "content");

const nodes = await loadCurriculum(contentRoot);
const issues = validateCurriculum({ nodes, visualizationIds: VISUALIZATION_IDS });

const files = await collectMdxFiles(contentRoot);
const validNodeIds = new Set(nodes.map((node) => node.id));
const linkIssues = validateContentLinks(files, validNodeIds);

if (issues.length > 0 || linkIssues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.code}: ${issue.message}`);
  }
  for (const linkIssue of linkIssues) {
    console.error(`broken-content-link: ${linkIssue.file} -> ${linkIssue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Graph and content links valid: ${String(nodes.length)} nodes, ${String(files.length)} MDX files`,
  );
}
