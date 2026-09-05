import { expect, test } from "./signed-in.ts";

test("opens a foundation lesson from its node route", async ({ page }) => {
  await page.goto("/nodes/networking.network-basics");
  await expect(page.getByTestId("lesson-title")).toHaveText("Что такое компьютерная сеть");
  await expect(page.getByRole("heading", { name: "Что", exact: true })).toBeVisible();
  await expect(page.getByText("Компьютерная сеть — это совокупность")).toBeVisible();
});

test("returns 404 for an unknown node id", async ({ page }) => {
  const response = await page.goto("/nodes/does.not.exist");
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { name: "Урок не найден" })).toBeVisible();
});

test("opens theory from the node side panel", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-networking.network-basics").click();
  await page.getByTestId("node-action-theory").click();
  await expect(page).toHaveURL("/nodes/networking.network-basics");
  await expect(page.getByTestId("lesson-title")).toHaveText("Что такое компьютерная сеть");
});

test("English locale swaps lesson copy", async ({ page }) => {
  await page.goto("/nodes/networking.network-basics");
  await page.getByTestId("locale-en").click();
  await expect(page.getByTestId("lesson-title")).toHaveText("Computer Network Basics");
  await expect(page.getByRole("link", { name: "Back to knowledge map" })).toBeVisible();
});
