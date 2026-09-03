import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { collectMdxFiles } from "./collect-mdx-files.ts";

describe("collectMdxFiles", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "collect-mdx-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  it("recursively collects only .mdx files", async () => {
    writeFileSync(path.join(tempDir, "file1.mdx"), "MDX content 1");
    writeFileSync(path.join(tempDir, "ignore.md"), "MD content");
    writeFileSync(path.join(tempDir, "ignore.txt"), "TXT content");

    const subDir = path.join(tempDir, "sub");
    mkdirSync(subDir);
    writeFileSync(path.join(subDir, "file2.mdx"), "MDX content 2");

    const collected = await collectMdxFiles(tempDir);
    expect(collected).toHaveLength(2);
    expect(collected.some((f) => f.endsWith("file1.mdx"))).toBe(true);
    expect(collected.some((f) => f.endsWith("file2.mdx"))).toBe(true);
  });
});
