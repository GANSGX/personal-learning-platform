import { describe, expect, it } from "vitest";

import { messages } from "./messages.ts";

describe("i18n messages", () => {
  it("keeps the same keys in Russian and English", () => {
    expect(Object.keys(messages.ru).sort()).toEqual(Object.keys(messages.en).sort());
  });
});
