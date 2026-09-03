import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env["CI"]);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    colorScheme: "dark",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /.*visual\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: /.*visual\.spec\.ts/,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
      testIgnore: /.*visual\.spec\.ts/,
    },
    {
      name: "visual",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*visual\.spec\.ts/,
    },
  ],
  webServer: {
    command: isCi ? "pnpm start" : "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !isCi,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "anon-key-test-fixture",
      NEXT_PUBLIC_ALLOW_E2E_AUTH: "true",
    },
  },
});
