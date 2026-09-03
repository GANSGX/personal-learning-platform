import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { validateLessonSections } from "./validate-sections.ts";

describe("validateLessonSections", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "validate-sections-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  it("passes when all mandatory foundation sections are present in Russian", () => {
    const validRussianFile = path.join(tempDir, "valid-ru.mdx");
    writeFileSync(
      validRussianFile,
      `---
id: test.node
title: Тест
level: foundation
---

## Что
Описание концепции

## Зачем
Обоснование нужности

## Как это работает
Механика работы

## Контрольная точка
Вопросы для самопроверки
`,
    );

    const issues = validateLessonSections([validRussianFile]);
    expect(issues).toEqual([]);
  });

  it("passes when all mandatory foundation sections are present in English", () => {
    const validEnglishFile = path.join(tempDir, "valid-en.en.mdx");
    writeFileSync(
      validEnglishFile,
      `---
id: test.node
title: Test
level: foundation
---

## What
Concept explanation

## Why
Why this matters

## How it works
Inner mechanics

## Checkpoint
Self-check question
`,
    );

    const issues = validateLessonSections([validEnglishFile]);
    expect(issues).toEqual([]);
  });

  it("fails when a foundation lesson is missing required sections", () => {
    const invalidFile = path.join(tempDir, "invalid.mdx");
    writeFileSync(
      invalidFile,
      `---
id: test.broken
title: Сломанный урок
level: foundation
---

## Что
Только описание
`,
    );

    const issues = validateLessonSections([invalidFile]);
    expect(issues.length).toBe(3);
    const missing = issues.map((i) => i.missingSection);
    expect(missing).toContain("Why / Зачем");
    expect(missing).toContain("How / Как");
    expect(missing).toContain("Checkpoint / Контрольная точка");
  });

  it("skips non-foundation lessons from mandatory section contract", () => {
    const advancedFile = path.join(tempDir, "advanced.mdx");
    writeFileSync(
      advancedFile,
      `---
id: test.advanced
title: Продвинутый уровень
level: infrastructure
---

Произвольный текст без строгих секций.
`,
    );

    const issues = validateLessonSections([advancedFile]);
    expect(issues).toEqual([]);
  });
});
