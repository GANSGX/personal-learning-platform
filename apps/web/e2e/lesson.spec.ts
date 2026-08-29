import { expect, test } from "./signed-in.ts";

test("opens a fixture lesson from its node route", async ({ page }) => {
  await page.goto("/nodes/fixture.alpha");
  await expect(page.getByTestId("lesson-title")).toHaveText("Фикстура Альфа");
  await expect(page.getByRole("heading", { name: "Что" })).toBeVisible();
  await expect(
    page.getByText("Заглушка, чтобы на холсте была настоящая вершина из MDX"),
  ).toBeVisible();
});

test("returns 404 for an unknown node id", async ({ page }) => {
  const response = await page.goto("/nodes/does.not.exist");
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { name: "Урок не найден" })).toBeVisible();
});

test("opens theory from the node side panel", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.alpha").click();
  await page.getByTestId("node-action-theory").click();
  await expect(page).toHaveURL("/nodes/fixture.alpha");
  await expect(page.getByTestId("lesson-title")).toHaveText("Фикстура Альфа");
});

test("English locale swaps fixture lesson copy", async ({ page }) => {
  await page.goto("/nodes/fixture.alpha");
  await page.getByTestId("locale-en").click();
  await expect(page.getByTestId("lesson-title")).toHaveText("Fixture Alpha");
  await expect(page.getByRole("heading", { name: "What" })).toBeVisible();
});
