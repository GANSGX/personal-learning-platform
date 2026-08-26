import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { KnowledgeNodeMetadata } from "@plp/domain";

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

async function collectMdxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(resolved)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(resolved);
    }
  }

  return files;
}
