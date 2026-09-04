import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadLabs, parseLabSource } from "./load-labs.ts";

describe("parseLabSource", () => {
  it("parses lab frontmatter and body", () => {
    const source = `---
id: pt-pc-pc
title: "Прямое соединение двух ПК"
titleEn: "PC to PC Direct Connection"
environment: "Cisco Packet Tracer"
goal: "Проверить связность между двумя ПК"
topology: "[PC0] <---> [PC1]"
checklist:
  - "Добавить 2 ПК"
  - "Соединить кроссовером"
---

## Описание
Подробное описание лабораторной работы.
`;

    const parsed = parseLabSource(source, "fallback");
    expect(parsed.id).toBe("pt-pc-pc");
    expect(parsed.title).toBe("Прямое соединение двух ПК");
    expect(parsed.titleEn).toBe("PC to PC Direct Connection");
    expect(parsed.environment).toBe("Cisco Packet Tracer");
    expect(parsed.goal).toBe("Проверить связность между двумя ПК");
    expect(parsed.topology).toBe("[PC0] <---> [PC1]");
    expect(parsed.checklist).toEqual(["Добавить 2 ПК", "Соединить кроссовером"]);
    expect(parsed.body).toBe("## Описание\nПодробное описание лабораторной работы.");
  });

  it("handles lab without frontmatter gracefully using fallback id", () => {
    const source = "## Просто текст лабы";
    const parsed = parseLabSource(source, "pt-simple");
    expect(parsed.id).toBe("pt-simple");
    expect(parsed.title).toBe("pt-simple");
    expect(parsed.environment).toBe("Cisco Packet Tracer");
    expect(parsed.body).toBe("## Просто текст лабы");
  });
});

describe("loadLabs", () => {
  it("returns empty record if directory does not exist", () => {
    const result = loadLabs("/non-existent-directory");
    expect(result).toEqual({});
  });

  it("walks directory and loads markdown labs", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "labs-test-"));
    try {
      mkdirSync(path.join(tempDir, "sub"));
      writeFileSync(path.join(tempDir, "README.md"), "# Readme");
      writeFileSync(
        path.join(tempDir, "lab1.md"),
        `---
id: lab-1
title: "Lab 1"
goal: "Goal 1"
---
Lab 1 text`,
      );
      writeFileSync(
        path.join(tempDir, "sub", "lab2.mdx"),
        `---
title: "Lab 2"
goal: "Goal 2"
---
Lab 2 text`,
      );

      const labs = loadLabs(tempDir);
      expect(Object.keys(labs)).toHaveLength(2);
      expect(labs["lab-1"]?.title).toBe("Lab 1");
      expect(labs["lab2"]?.title).toBe("Lab 2");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
