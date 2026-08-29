import { readFile } from "node:fs/promises";
import path from "node:path";

import type { KnowledgeNodeMetadata } from "@plp/domain";

import { collectMdxFiles } from "./collect-mdx-files.ts";
import { isLocaleSpecificLessonFilename } from "./lesson-locale.ts";
import { parseLessonSource } from "./parse-lesson.ts";

export async function loadCurriculum(rootDirectory: string): Promise<KnowledgeNodeMetadata[]> {
  const files = await collectMdxFiles(rootDirectory);
  const nodes: KnowledgeNodeMetadata[] = [];

  for (const file of files) {
    if (isLocaleSpecificLessonFilename(path.basename(file))) {
      continue;
    }

    const source = await readFile(file, "utf8");
    const lesson = parseLessonSource(source);
    nodes.push(lesson.metadata);
  }

  return nodes;
}
