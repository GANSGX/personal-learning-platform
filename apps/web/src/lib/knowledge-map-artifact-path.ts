import path from "node:path";

export function getKnowledgeMapArtifactPath(): string {
  return path.join(process.cwd(), "../../.cache/knowledge-map.json");
}
