import { readFile } from "node:fs/promises";

import type { KnowledgeNodeMetadata } from "@plp/domain";

import { collectMdxFiles } from "./collect-mdx-files.ts";
import { parseLessonSource } from "./parse-lesson.ts";

export async function loadCurriculum(rootDirectory: string): Promise<KnowledgeNodeMetadata[]> {
  const files = await collectMdxFiles(rootDirectory);
  const nodes: KnowledgeNodeMetadata[] = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const lesson = parseLessonSource(source);
    nodes.push(lesson.metadata);
  }

  return nodes;
}
