import { test as base } from "@playwright/test";

const E2E_AUTH_STORAGE_KEY = "plp-e2e-auth";

export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript((storageKey: string) => {
      globalThis.sessionStorage.setItem(storageKey, "1");
    }, E2E_AUTH_STORAGE_KEY);
    await run(page);
  },
});

export { expect } from "@playwright/test";
