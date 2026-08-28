import { expect, test } from "@playwright/test";

test("roadmap happy path: select node and see prerequisites", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toBeVisible();
  await page.getByTestId("graph-node-fixture.beta").click();
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Fixture Beta");
  await expect(page.getByTestId("node-requires")).toContainText("Fixture Alpha");
});

test("roadmap keyboard path: focus node and press Enter to open panel", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("graph-node-fixture.beta").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("node-side-panel-title")).toHaveText("Fixture Beta");
  await expect(page.getByTestId("node-requires")).toContainText("Fixture Alpha");
});
