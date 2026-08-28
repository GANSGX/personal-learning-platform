import { readFile } from "node:fs/promises";

import { parseKnowledgeMapArtifact, type CurriculumLayout } from "@plp/graph";
import type { KnowledgeNodeMetadata } from "@plp/domain";

import { getKnowledgeMapArtifactPath } from "./knowledge-map-artifact-path";

type KnowledgeMapData = {
  layout: CurriculumLayout;
  nodes: KnowledgeNodeMetadata[];
};

export async function loadKnowledgeMap(): Promise<KnowledgeMapData> {
  const raw = await readFile(getKnowledgeMapArtifactPath(), "utf8");
  const artifact = parseKnowledgeMapArtifact(JSON.parse(raw));

  return {
    layout: artifact.layout,
    nodes: artifact.nodes,
  };
}
