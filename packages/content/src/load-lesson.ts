import { readFile } from "node:fs/promises";

import { nodeIdSchema } from "@plp/domain";

import { collectMdxFiles } from "./collect-mdx-files.ts";
import { parseLessonSource, type ParsedLesson } from "./parse-lesson.ts";

export async function loadLessonByNodeId(
  rootDirectory: string,
  nodeId: string,
): Promise<ParsedLesson | null> {
  const parsedNodeId = nodeIdSchema.safeParse(nodeId);
  if (!parsedNodeId.success) {
    return null;
  }

  const files = await collectMdxFiles(rootDirectory);

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const lesson = parseLessonSource(source);
    if (lesson.metadata.id === parsedNodeId.data) {
      return lesson;
    }
  }

  return null;
}
