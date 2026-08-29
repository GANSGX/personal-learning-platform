import { describe, expect, it } from "vitest";

import { oauthErrorFromSearchParams } from "./oauth-callback-error.ts";

describe("oauthErrorFromSearchParams", () => {
  it("prefers error_description over error", () => {
    const params = new URLSearchParams(
      "error=validation_failed&error_description=Unsupported+provider%3A+provider+is+not+enabled",
    );

    expect(oauthErrorFromSearchParams(params)).toBe(
      "Unsupported provider: provider is not enabled",
    );
  });

  it("falls back to error when description is missing", () => {
    const params = new URLSearchParams("error=access_denied");

    expect(oauthErrorFromSearchParams(params)).toBe("access_denied");
  });

  it("returns null when no OAuth error is present", () => {
    expect(oauthErrorFromSearchParams(new URLSearchParams("code=abc"))).toBeNull();
  });
});
