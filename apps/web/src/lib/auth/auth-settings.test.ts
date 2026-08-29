import { describe, expect, it, vi } from "vitest";

import { readGithubAuthEnabled } from "./auth-settings.ts";

const env = {
  url: "https://example.supabase.co",
  anonKey: "test-anon-key",
};

describe("readGithubAuthEnabled", () => {
  it("returns true when GitHub is enabled", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ external: { github: true, email: true } }),
    });

    await expect(readGithubAuthEnabled(env, fetchImpl)).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(
      new URL("/auth/v1/settings", env.url),
      expect.objectContaining({
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${env.anonKey}`,
        },
      }),
    );
  });

  it("returns false when GitHub is disabled", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ external: { github: false } }),
    });

    await expect(readGithubAuthEnabled(env, fetchImpl)).resolves.toBe(false);
  });

  it("returns null when the settings request fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await expect(readGithubAuthEnabled(env, fetchImpl)).resolves.toBeNull();
  });

  it("returns null when the payload is invalid", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ external: {} }),
    });

    await expect(readGithubAuthEnabled(env, fetchImpl)).resolves.toBeNull();
  });
});
