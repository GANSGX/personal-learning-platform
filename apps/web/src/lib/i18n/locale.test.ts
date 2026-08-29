import { describe, expect, it } from "vitest";

import { parseLocale } from "./locale.ts";

describe("parseLocale", () => {
  it("defaults to Russian", () => {
    expect(parseLocale(null)).toBe("ru");
    expect(parseLocale("de")).toBe("ru");
  });

  it("accepts English", () => {
    expect(parseLocale("en")).toBe("en");
  });
});
