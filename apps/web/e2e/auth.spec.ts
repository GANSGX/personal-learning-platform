import { expect, test } from "@playwright/test";

test("login page renders when cloud auth is not configured", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Cloud sign-in unavailable")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to map" })).toBeVisible();
});

test("top bar hides sign-in controls without supabase env", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("sign-in-link")).toHaveCount(0);
});
