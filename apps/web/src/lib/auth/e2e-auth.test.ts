import { afterEach, describe, expect, it } from "vitest";

import { E2E_USER, isE2eAuthActive } from "./e2e-auth.ts";

describe("e2e-auth", () => {
  const originalEnv = process.env["NEXT_PUBLIC_ALLOW_E2E_AUTH"];

  afterEach(() => {
    process.env["NEXT_PUBLIC_ALLOW_E2E_AUTH"] = originalEnv;
    try {
      globalThis.sessionStorage.removeItem("plp-e2e-auth");
    } catch {
      // ignore
    }
  });

  it("exports valid E2E user object", () => {
    expect(E2E_USER.id).toBe("00000000-0000-4000-8000-000000000001");
    expect(E2E_USER.email).toBe("e2e@plp.test");
  });

  it("returns false if e2e auth storage is not set", () => {
    expect(isE2eAuthActive()).toBe(false);
  });
});
