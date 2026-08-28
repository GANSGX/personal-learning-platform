import { readdir } from "node:fs/promises";
import path from "node:path";

export async function collectMdxFiles(directory: string): Promise<string[]> {
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
