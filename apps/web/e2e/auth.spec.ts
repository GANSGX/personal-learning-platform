import { expect, test } from "@playwright/test";

test("login page renders cloud sign-in form", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByTestId("login-form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with GitHub" })).toBeVisible();
});

test("top bar shows sign-in link when supabase env is configured", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("sign-in-link")).toBeVisible();
});
