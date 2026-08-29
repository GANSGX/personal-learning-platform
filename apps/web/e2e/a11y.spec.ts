import AxeBuilder from "@axe-core/playwright";
import { expect, test as guestTest } from "@playwright/test";

import { test as signedInTest } from "./signed-in.ts";

guestTest("login has no serious accessibility violations", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByTestId("login-form")).toBeVisible();
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations).toEqual([]);
});

signedInTest("home has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
