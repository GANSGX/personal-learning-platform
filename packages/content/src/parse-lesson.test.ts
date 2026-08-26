import { describe, expect, it } from "vitest";

import { parseLessonSource } from "./parse-lesson.ts";

describe("parseLessonSource", () => {
  it("parses frontmatter into a knowledge node", () => {
    const lesson = parseLessonSource(`---
id: networking.tcp
title: TCP
level: foundation
requires:
  - networking.ip
---

# TCP
`);

    expect(lesson.metadata.id).toBe("networking.tcp");
    expect(lesson.metadata.requires).toEqual(["networking.ip"]);
    expect(lesson.body).toContain("# TCP");
  });

  it("rejects files without frontmatter", () => {
    expect(() => parseLessonSource("# TCP")).toThrow(/frontmatter/i);
  });

  it("allows a lesson whose body is empty", () => {
    const lesson = parseLessonSource(`---
id: networking.tcp
title: TCP
level: foundation
---`);

    expect(lesson.metadata.id).toBe("networking.tcp");
    expect(lesson.body).toBe("");
  });
});
