import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { collectLabIds, collectMdxFiles, loadCurriculum, loadLabs } from "@plp/content";
import type { KnowledgeMapArtifact } from "@plp/graph";
import { layoutCurriculumForView, parseKnowledgeMapArtifact, validateCurriculum } from "@plp/graph";
import { VISUALIZATION_IDS } from "@plp/visualizations/registry-ids";

const contentRoot = path.resolve(process.cwd(), "content");
const labsRoot = path.resolve(process.cwd(), "labs");
const outputPath = path.resolve(process.cwd(), ".cache/knowledge-map.json");

async function hashContentFiles(contentDir: string, labsDir: string): Promise<string> {
  const contentFiles = await collectMdxFiles(contentDir);
  const hash = createHash("sha256");

  for (const file of contentFiles.sort()) {
    hash.update(file);
    hash.update(await readFile(file));
  }

  const labs = loadLabs(labsDir);
  hash.update(JSON.stringify(labs));

  return hash.digest("hex");
}

async function readExistingArtifact(): Promise<KnowledgeMapArtifact | null> {
  try {
    const raw = await readFile(outputPath, "utf8");
    return parseKnowledgeMapArtifact(JSON.parse(raw));
  } catch {
    return null;
  }
}

const nodes = await loadCurriculum(contentRoot);
const labIds = collectLabIds(labsRoot);
const issues = validateCurriculum({ nodes, visualizationIds: VISUALIZATION_IDS, labIds });

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.code}: ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  const contentHash = await hashContentFiles(contentRoot, labsRoot);
  const existing = await readExistingArtifact();

  if (existing?.contentHash === contentHash) {
    console.log(`Graph artifact up to date: ${String(nodes.length)} nodes`);
  } else {
    const layout = await layoutCurriculumForView(nodes, "foundation");
    const labs = loadLabs(labsRoot);
    const artifact: KnowledgeMapArtifact = {
      contentHash,
      generatedAt: new Date().toISOString(),
      nodes: [...nodes],
      labs,
      layout,
    };

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
    console.log(
      `Graph artifact written: ${String(nodes.length)} nodes, ${String(Object.keys(labs).length)} labs → ${outputPath}`,
    );
  }
}
