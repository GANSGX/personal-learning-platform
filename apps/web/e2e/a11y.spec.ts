import AxeBuilder from "@axe-core/playwright";
import { expect, test as guestTest } from "@playwright/test";

import { test as signedInTest } from "./signed-in.ts";

guestTest("login has no serious accessibility violations", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByTestId("login-form")).toBeVisible();
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations).toEqual([]);
});

guestTest("login error state has no serious accessibility violations", async ({ page }) => {
  await page.goto("/login?error=access_denied");
  await expect(page.getByTestId("login-error")).toBeVisible();

  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations).toEqual([]);
});

signedInTest("home has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

signedInTest(
  "selected node side panel has no serious accessibility violations",
  async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("graph-node-fixture.alpha").click();
    await expect(page.getByTestId("node-side-panel-title")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  },
);

signedInTest("lesson reader has no serious accessibility violations", async ({ page }) => {
  await page.goto("/nodes/fixture.alpha");
  await expect(page.getByTestId("lesson-title")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

signedInTest(
  "mobile navigation drawer has no serious accessibility violations",
  async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Открыть навигацию" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
    expect(results.violations).toEqual([]);
  },
);
