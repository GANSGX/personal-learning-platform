import { expect, test } from "@playwright/test";

test("opens a fixture lesson from its node route", async ({ page }) => {
  await page.goto("/nodes/fixture.alpha");
  await expect(page.getByTestId("lesson-title")).toHaveText("Fixture Alpha");
  await expect(page.getByRole("heading", { name: "What" })).toBeVisible();
  await expect(
    page.getByText("Placeholder node so the canvas has a real MDX-backed vertex"),
  ).toBeVisible();
});

test("returns 404 for an unknown node id", async ({ page }) => {
  const response = await page.goto("/nodes/does.not.exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Lesson not found" })).toBeVisible();
});

test("opens theory from the node side panel", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-theory").click();
  await expect(page).toHaveURL("/nodes/fixture.alpha");
  await expect(page.getByTestId("lesson-title")).toHaveText("Fixture Alpha");
});
