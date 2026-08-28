import { expect, test } from "@playwright/test";

test("home shows the knowledge map with curriculum nodes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByTestId("app-top-bar")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Knowledge map" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toBeVisible();
  await expect(page.getByTestId("graph-view-foundation")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.beta")).toBeVisible();
  await expect(page.getByText("No node selected")).toBeVisible();
});

test("stub graph views show an empty state without crashing", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("graph-view-infrastructure").click();
  await expect(page.getByTestId("graph-view-stub")).toBeVisible();
  await expect(page.getByText("Infrastructure view")).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.alpha")).not.toBeVisible();

  await page.getByTestId("graph-view-foundation").click();
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
});

test("desktop sidebar lists stub tracks without crashing", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Application" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Networking I Soon" })).toBeDisabled();
});
