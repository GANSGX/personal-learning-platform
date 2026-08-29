import { describe, expect, it } from "vitest";

import { isLocaleSpecificLessonFilename, lessonFileLocale } from "./lesson-locale.ts";

describe("lesson locale filenames", () => {
  it("treats unsuffixed mdx as the default Russian source", () => {
    expect(isLocaleSpecificLessonFilename("alpha.mdx")).toBe(false);
    expect(lessonFileLocale("alpha.mdx")).toBeNull();
  });

  it("recognizes English lesson files", () => {
    expect(isLocaleSpecificLessonFilename("alpha.en.mdx")).toBe(true);
    expect(lessonFileLocale("alpha.en.mdx")).toBe("en");
  });
});
