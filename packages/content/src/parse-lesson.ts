import { knowledgeNodeMetadataSchema, type KnowledgeNodeMetadata } from "@plp/domain";
import { parse as parseYaml } from "yaml";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/;

export type ParsedLesson = {
  metadata: KnowledgeNodeMetadata;
  body: string;
};

export function parseLessonSource(source: string): ParsedLesson {
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) {
    throw new Error("Lesson is missing YAML frontmatter");
  }

  const rawFrontmatter = match[1];
  const body = match[2] ?? "";
  if (rawFrontmatter === undefined) {
    throw new Error("Lesson is missing YAML frontmatter");
  }

  const parsedYaml: unknown = parseYaml(rawFrontmatter);
  const metadata = knowledgeNodeMetadataSchema.parse(parsedYaml);

  return { metadata, body };
}
