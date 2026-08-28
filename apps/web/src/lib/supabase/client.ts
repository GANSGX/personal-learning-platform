"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "./env.ts";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const env = getSupabasePublicEnv();

  if (env === null) {
    return null;
  }

  browserClient ??= createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
