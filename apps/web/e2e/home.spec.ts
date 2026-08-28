import { expect, test } from "@playwright/test";

test("home shows the knowledge map with curriculum nodes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Knowledge map" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toBeVisible();
  await expect(page.getByTestId("graph-view-foundation")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.beta")).toBeVisible();
  await expect(page.getByText("No node selected")).toBeVisible();
});

test("selecting a node shows prerequisites in the side panel", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.beta").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Fixture Beta");
  await expect(page.getByTestId("node-requires")).toContainText("Fixture Alpha");
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
