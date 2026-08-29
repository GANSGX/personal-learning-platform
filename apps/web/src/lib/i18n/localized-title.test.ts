import { describe, expect, it } from "vitest";

import { localizedNodeTitle } from "./localized-title.ts";

describe("localizedNodeTitle", () => {
  const node = { title: "Фикстура Альфа", titleEn: "Fixture Alpha" };

  it("uses the default title for Russian", () => {
    expect(localizedNodeTitle(node, "ru", "fixture.alpha")).toBe("Фикстура Альфа");
  });

  it("uses titleEn for English when present", () => {
    expect(localizedNodeTitle(node, "en", "fixture.alpha")).toBe("Fixture Alpha");
  });

  it("falls back to the node id when metadata is missing", () => {
    expect(localizedNodeTitle(undefined, "ru", "fixture.alpha")).toBe("fixture.alpha");
  });
});
