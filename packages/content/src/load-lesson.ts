import { readFile } from "node:fs/promises";
import path from "node:path";

import { nodeIdSchema } from "@plp/domain";

import { collectMdxFiles } from "./collect-mdx-files.ts";
import {
  defaultLessonLocale,
  isLocaleSpecificLessonFilename,
  lessonFileLocale,
  type LessonLocale,
} from "./lesson-locale.ts";
import { parseLessonSource, type ParsedLesson } from "./parse-lesson.ts";

export async function loadLessonByNodeId(
  rootDirectory: string,
  nodeId: string,
  locale: LessonLocale = defaultLessonLocale,
): Promise<ParsedLesson | null> {
  const parsedNodeId = nodeIdSchema.safeParse(nodeId);
  if (!parsedNodeId.success) {
    return null;
  }

  const files = await collectMdxFiles(rootDirectory);
  let fallback: ParsedLesson | null = null;

  for (const file of files) {
    const filename = path.basename(file);
    const fileLocale = lessonFileLocale(filename);
    const isDefaultFile = !isLocaleSpecificLessonFilename(filename);

    if (locale === "ru" && !isDefaultFile) {
      continue;
    }

    if (locale !== "ru" && fileLocale !== locale && !isDefaultFile) {
      continue;
    }

    const source = await readFile(file, "utf8");
    const lesson = parseLessonSource(source);

    if (lesson.metadata.id !== parsedNodeId.data) {
      continue;
    }

    if (locale === "ru" && isDefaultFile) {
      return lesson;
    }

    if (fileLocale === locale) {
      return lesson;
    }

    if (isDefaultFile) {
      fallback = lesson;
    }
  }

  return fallback;
}
