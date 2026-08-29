import type { User } from "@supabase/supabase-js";

const E2E_AUTH_STORAGE_KEY = "plp-e2e-auth";

export const E2E_USER: User = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "e2e@plp.test",
  email_confirmed_at: "2026-01-01T00:00:00.000Z",
  phone: "",
  confirmed_at: "2026-01-01T00:00:00.000Z",
  last_sign_in_at: "2026-01-01T00:00:00.000Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  identities: [],
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  is_anonymous: false,
};

function isE2eAuthAllowed(): boolean {
  return (
    process.env["NEXT_PUBLIC_ALLOW_E2E_AUTH"] === "true" || process.env.NODE_ENV !== "production"
  );
}

export function isE2eAuthActive(): boolean {
  if (!isE2eAuthAllowed()) {
    return false;
  }

  try {
    return globalThis.sessionStorage.getItem(E2E_AUTH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
