import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export function collectLabIds(labsRoot: string): Set<string> {
  const labIds = new Set<string>();

  if (!existsSync(labsRoot)) {
    return labIds;
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
        const fileId = path.basename(entry, path.extname(entry));
        labIds.add(fileId);

        const content = readFileSync(fullPath, "utf8");
        const match = /^id:\s*([^\s]+)/m.exec(content);
        if (match?.[1] !== undefined) {
          labIds.add(match[1]);
        }
      }
    }
  }

  walk(labsRoot);
  return labIds;
}
