import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { labSchema, type Lab } from "@plp/domain";
import { parse as parseYaml } from "yaml";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/;

export type ParsedLab = Lab & {
  body: string;
};

export function parseLabSource(source: string, fallbackId: string): ParsedLab {
  const match = FRONTMATTER_PATTERN.exec(source);
  let rawFrontmatter = "";
  let body = source.trim();

  if (match !== null && match[1] !== undefined) {
    rawFrontmatter = match[1];
    body = (match[2] ?? "").trim();
  }

  const parsedYaml: unknown = rawFrontmatter ? parseYaml(rawFrontmatter) : {};
  const rawData =
    typeof parsedYaml === "object" && parsedYaml !== null
      ? (parsedYaml as Record<string, unknown>)
      : {};

  const id =
    typeof rawData["id"] === "string" && rawData["id"].trim().length > 0
      ? rawData["id"].trim()
      : fallbackId;

  const metadata = labSchema.parse({
    id,
    title: rawData["title"] ?? fallbackId,
    titleEn: rawData["titleEn"],
    description: rawData["description"],
    environment: rawData["environment"] ?? "Cisco Packet Tracer",
    goal: rawData["goal"] ?? rawData["title"] ?? fallbackId,
    topology: rawData["topology"],
    checklist: Array.isArray(rawData["checklist"]) ? rawData["checklist"] : [],
  });

  return {
    ...metadata,
    body,
  };
}

export function loadLabs(labsRoot: string): Record<string, ParsedLab> {
  const labs: Record<string, ParsedLab> = {};

  if (!existsSync(labsRoot)) {
    return labs;
  }

  function walk(currentDir: string): void {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (
        (entry.endsWith(".md") || entry.endsWith(".mdx")) &&
        entry.toLowerCase() !== "readme.md"
      ) {
        const fallbackId = path.basename(entry, path.extname(entry));
        const source = readFileSync(fullPath, "utf8");
        const parsed = parseLabSource(source, fallbackId);
        labs[parsed.id] = parsed;
      }
    }
  }

  walk(labsRoot);
  return labs;
}
