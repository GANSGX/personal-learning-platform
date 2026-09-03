import { afterEach, describe, expect, it } from "vitest";

import { getSupabasePublicEnv, isSupabaseConfigured } from "./env.ts";

describe("supabase env", () => {
  const originalUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const originalKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  afterEach(() => {
    process.env["NEXT_PUBLIC_SUPABASE_URL"] = originalUrl;
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = originalKey;
  });

  it("returns null when env vars are missing", () => {
    delete process.env["NEXT_PUBLIC_SUPABASE_URL"];
    delete process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
    expect(getSupabasePublicEnv()).toBeNull();
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("returns parsed env when valid url and key are present", () => {
    process.env["NEXT_PUBLIC_SUPABASE_URL"] = "https://example.supabase.co";
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "anon-key-123";
    expect(getSupabasePublicEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key-123",
    });
    expect(isSupabaseConfigured()).toBe(true);
  });
});
