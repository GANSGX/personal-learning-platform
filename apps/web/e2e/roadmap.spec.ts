import type { Page } from "@playwright/test";

import { expect, test } from "./signed-in.ts";

async function masterFixtureAlpha(page: Page) {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-theory").click();
  await page.getByTestId("lesson-mark-theory-complete").click();
  await page.getByRole("link", { name: "Back to knowledge map" }).click();
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-mark-practice").click();
  await page.getByTestId("node-action-mark-checkpoint").click();
  await expect(page.getByTestId("node-side-panel-status")).toHaveText("Mastered");
}

test("roadmap happy path: select node and see prerequisites", async ({ page }) => {
  await masterFixtureAlpha(page);
  await page.getByTestId("graph-node-fixture.beta").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Fixture Beta");
  await expect(page.getByTestId("node-requires")).toContainText("Fixture Alpha");
});

test("roadmap keyboard path: focus node and press Enter to open panel", async ({ page }) => {
  await masterFixtureAlpha(page);
  await page.getByTestId("graph-node-fixture.beta").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Fixture Beta");
});

test("completing checkpoint updates node status on the map", async ({ page }) => {
  await masterFixtureAlpha(page);
  await expect(page.getByTestId("graph-node-fixture.alpha")).toHaveAttribute(
    "data-node-status",
    "MASTERED",
  );
});
