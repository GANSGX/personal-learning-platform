import path from "node:path";
import process from "node:process";

import {
  collectLabIds,
  collectMdxFiles,
  loadCurriculum,
  validateContentLinks,
  validateLessonSections,
} from "@plp/content";
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

const files = await collectMdxFiles(contentRoot);
const validNodeIds = new Set(nodes.map((node) => node.id));
const linkIssues = validateContentLinks(files, validNodeIds);
const sectionIssues = validateLessonSections(files);

if (issues.length > 0 || linkIssues.length > 0 || sectionIssues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.code}: ${issue.message}`);
  }
  for (const linkIssue of linkIssues) {
    console.error(`broken-content-link: ${linkIssue.file} -> ${linkIssue.message}`);
  }
  for (const sectionIssue of sectionIssues) {
    console.error(`missing-foundation-section: ${sectionIssue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Graph, content links, and lesson sections valid: ${String(nodes.length)} nodes, ${String(labIds.size)} labs, ${String(files.length)} MDX files`,
  );
}
