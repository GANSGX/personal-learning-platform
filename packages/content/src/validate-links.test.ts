import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { validateContentLinks } from "./validate-links.ts";

describe("validateContentLinks", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "content-links-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  it("passes when all internal links, anchors, and relative files are valid", () => {
    const targetFile = path.join(tempDir, "target.mdx");
    writeFileSync(targetFile, "# Target\nContent");

    const sampleFile = path.join(tempDir, "sample.mdx");
    writeFileSync(
      sampleFile,
      `# Main Section

Link to [external](https://example.com) and [mail](mailto:test@example.com).
Link to [valid anchor](#main-section).
Link to [empty anchor](#).
Link to [valid node](/nodes/valid.node?view=full#main).
Link to [valid relative](./target.mdx).
`,
    );

    const issues = validateContentLinks([sampleFile], new Set(["valid.node"]));
    expect(issues).toEqual([]);
  });

  it("flags broken node links, invalid anchors, and missing relative files", () => {
    const sampleFile = path.join(tempDir, "broken.mdx");
    writeFileSync(
      sampleFile,
      `# Header

Link to [missing anchor](#non-existent).
Link to [missing node](/nodes/missing.node).
Link to [missing file](./does-not-exist.md).
Link to [missing parent file](../missing-parent.md).
`,
    );

    const issues = validateContentLinks([sampleFile], new Set(["valid.node"]));
    expect(issues).toHaveLength(4);
    expect(issues[0]?.message).toContain("Broken internal heading anchor");
    expect(issues[1]?.message).toContain("Target node 'missing.node' does not exist");
    expect(issues[2]?.message).toContain("Referenced relative file does not exist");
    expect(issues[3]?.message).toContain("Referenced relative file does not exist");
  });
});
