import { expect, test } from "./signed-in.ts";

test("home shows the knowledge map with curriculum nodes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByTestId("app-top-bar")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Карта знаний" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Холст графа знаний" })).toBeVisible();
  await expect(page.getByTestId("graph-view-networking")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("graph-node-networking.network-basics")).toBeVisible();
  await expect(page.getByTestId("node-side-panel-title")).toBeVisible();
});

test("clicking locked node selects it and displays prerequisites", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-networking.ethernet").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText(
    "Ethernet, кадры и MAC-адресация",
  );
  await expect(page.getByTestId("node-side-panel-status")).toHaveText("Закрыт");
  await expect(page.getByTestId("node-requires")).toContainText("Что такое компьютерная сеть");
});

test("stub graph views show an empty state without crashing", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("graph-view-my-path").click();
  await expect(page.getByTestId("graph-view-stub")).toBeVisible();
  await expect(page.getByText("Мой текущий путь")).toBeVisible();
  await expect(page.getByTestId("graph-node-networking.network-basics")).not.toBeVisible();

  await page.getByTestId("graph-view-networking").click();
  await expect(page.getByTestId("graph-node-networking.network-basics")).toBeVisible();
});

test("desktop sidebar lists tracks with navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const sidebar = page.getByRole("navigation", { name: "Приложение" });
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Сети" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Windows" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Linux" })).toBeVisible();
});
