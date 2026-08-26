import { expect, test } from "@playwright/test";

test("home shows the knowledge map shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Knowledge map" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toBeVisible();
});
