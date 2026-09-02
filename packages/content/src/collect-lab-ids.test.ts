import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { collectLabIds } from "./collect-lab-ids.ts";

describe("collectLabIds", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "collect-labs-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  it("returns empty set if labs root does not exist", () => {
    const nonExistent = path.join(tempDir, "does-not-exist");
    expect(collectLabIds(nonExistent)).toEqual(new Set());
  });

  it("ignores README.md and collects lab IDs from filenames and frontmatter", () => {
    writeFileSync(path.join(tempDir, "README.md"), "# Labs\nOverview");
    writeFileSync(path.join(tempDir, "sample-lab.md"), "# Sample Lab");

    const subDir = path.join(tempDir, "network");
    mkdirSync(subDir);
    writeFileSync(
      path.join(subDir, "packet-tracer.mdx"),
      "---\nid: custom-packet-id\n---\n# PT Lab",
    );

    const ids = collectLabIds(tempDir);
    expect(ids).toContain("sample-lab");
    expect(ids).toContain("packet-tracer");
    expect(ids).toContain("custom-packet-id");
    expect(ids.has("README")).toBe(false);
  });
});
