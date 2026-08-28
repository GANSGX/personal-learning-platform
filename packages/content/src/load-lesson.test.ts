import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadLessonByNodeId } from "./load-lesson.ts";

describe("loadLessonByNodeId", () => {
  it("returns a lesson when the node id exists", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plp-lesson-"));
    await writeFile(
      path.join(root, "alpha.mdx"),
      `---
id: fixture.alpha
title: Fixture Alpha
level: foundation
---

## What

Lesson body.
`,
    );

    const lesson = await loadLessonByNodeId(root, "fixture.alpha");
    expect(lesson?.metadata.title).toBe("Fixture Alpha");
    expect(lesson?.body).toContain("## What");
  });

  it("returns null for an unknown node id", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plp-lesson-"));
    await mkdir(root, { recursive: true });

    const lesson = await loadLessonByNodeId(root, "does.not.exist");
    expect(lesson).toBeNull();
  });

  it("returns null for an invalid node id", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plp-lesson-"));
    const lesson = await loadLessonByNodeId(root, "INVALID");
    expect(lesson).toBeNull();
  });
});
