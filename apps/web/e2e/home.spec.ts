import { expect, test } from "./signed-in.ts";

test("home shows the knowledge map with curriculum nodes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByTestId("app-top-bar")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Карта знаний" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Холст графа знаний" })).toBeVisible();
  await expect(page.getByTestId("graph-view-foundation")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
  await expect(page.getByTestId("node-side-panel-title")).toBeVisible();
});

test("clicking locked node selects it and displays prerequisites", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.beta").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Фикстура Бета");
  await expect(page.getByTestId("node-side-panel-status")).toHaveText("Закрыт");
  await expect(page.getByTestId("node-requires")).toContainText("Фикстура Альфа");
});

test("stub graph views show an empty state without crashing", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("graph-view-infrastructure").click();
  await expect(page.getByTestId("graph-view-stub")).toBeVisible();
  await expect(page.getByText("Вид инфраструктуры")).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.alpha")).not.toBeVisible();

  await page.getByTestId("graph-view-foundation").click();
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
});

test("desktop sidebar lists stub tracks without crashing", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Приложение" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Networking I Скоро" })).toBeDisabled();
});
