import { readFileSync } from "node:fs";

import { parseLessonSource } from "./parse-lesson.ts";

export type SectionValidationIssue = {
  file: string;
  nodeId: string;
  missingSection: string;
  message: string;
};

const REQUIRED_SECTION_MATCHERS: Array<{
  name: string;
  pattern: RegExp;
}> = [
  { name: "What / Что", pattern: /^##\s+(что|what)(?:\s|$|:)/i },
  { name: "Why / Зачем", pattern: /^##\s+(зачем|почему|why)(?:\s|$|:)/i },
  {
    name: "How / Как",
    pattern: /^##\s+(как|как это работает|how|how it works)(?:\s|$|:)/i,
  },
  {
    name: "Checkpoint / Контрольная точка",
    pattern: /^##\s+(контрольная точка|чекпоинт|проверка|контроль|checkpoint)(?:\s|$|:)/i,
  },
];

export function validateLessonSections(filePaths: readonly string[]): SectionValidationIssue[] {
  const issues: SectionValidationIssue[] = [];

  for (const file of filePaths) {
    let source: string;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    let parsed;
    try {
      parsed = parseLessonSource(source);
    } catch {
      continue;
    }

    // Spec §37 section contract is mandatory for foundation curriculum nodes
    if (parsed.metadata.level !== "foundation") {
      continue;
    }

    const lines = parsed.body.split(/\r?\n/);
    const headings = lines.filter((line) => line.startsWith("## "));

    for (const requirement of REQUIRED_SECTION_MATCHERS) {
      const isPresent = headings.some((heading) => requirement.pattern.test(heading.trim()));

      if (!isPresent) {
        issues.push({
          file,
          nodeId: parsed.metadata.id,
          missingSection: requirement.name,
          message: `Foundation lesson '${parsed.metadata.id}' in '${file}' is missing required section '${requirement.name}' (spec §37).`,
        });
      }
    }
  }

  return issues;
}
