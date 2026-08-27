import { expect, test } from "@playwright/test";

test("home shows the knowledge map with curriculum nodes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Knowledge map" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.alpha")).toBeVisible();
  await expect(page.getByTestId("graph-node-fixture.beta")).toBeVisible();
  await expect(page.getByText("No node selected")).toBeVisible();
});
