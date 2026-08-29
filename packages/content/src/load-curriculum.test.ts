import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadCurriculum } from "./load-curriculum.ts";

describe("loadCurriculum", () => {
  it("loads nested mdx lessons", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plp-content-"));
    const nested = path.join(root, "foundation", "networking");
    await mkdir(nested, { recursive: true });
    await writeFile(
      path.join(nested, "tcp.mdx"),
      `---
id: networking.tcp
title: TCP
level: foundation
---
`,
    );

    await writeFile(
      path.join(nested, "tcp.en.mdx"),
      `---
id: networking.tcp
title: TCP
level: foundation
---
`,
    );

    const nodes = await loadCurriculum(root);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.id).toBe("networking.tcp");
  });
});
