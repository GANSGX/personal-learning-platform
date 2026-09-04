import type { Page } from "@playwright/test";

import { expect, test } from "./signed-in.ts";

async function masterFixtureAlpha(page: Page) {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-theory").click();
  await page.getByTestId("lesson-mark-theory-complete").click();
  await page.getByRole("link", { name: "Назад к карте знаний" }).click();
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-mark-practice").click();
  await page.getByTestId("node-action-mark-checkpoint").click();
  await expect(page.getByTestId("node-side-panel-status")).toHaveText("Освоен");
}

test("roadmap happy path: select node and see prerequisites", async ({ page }) => {
  await masterFixtureAlpha(page);
  await page.getByTestId("graph-node-fixture.beta").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Фикстура Бета");
  await expect(page.getByTestId("node-requires")).toContainText("Фикстура Альфа");
});

test("roadmap keyboard path: focus node and press Enter to open panel", async ({ page }) => {
  await masterFixtureAlpha(page);
  await page.getByTestId("graph-node-fixture.beta").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Фикстура Бета");
});

test("completing checkpoint updates node status on the map", async ({ page }) => {
  await masterFixtureAlpha(page);
  await expect(page.getByTestId("graph-node-fixture.alpha")).toHaveAttribute(
    "data-node-status",
    "MASTERED",
  );
});

test("hands-on lab card opens sheet with topology and checklist", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.alpha").click();
  await expect(page.getByTestId("node-labs")).toBeVisible();
  const labCard = page.getByTestId("node-lab-card-pt-pc-pc");
  await expect(labCard).toBeVisible();
  await labCard.click();

  const labSheet = page.getByTestId("node-lab-sheet-pt-pc-pc");
  await expect(labSheet).toBeVisible();
  await expect(labSheet.getByText("Прямое соединение двух ПК")).toBeVisible();
  await expect(labSheet.locator("pre")).toContainText("Copper Cross-Over");
});
