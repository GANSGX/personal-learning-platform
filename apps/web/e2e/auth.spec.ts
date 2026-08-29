import { expect, test } from "@playwright/test";

test("login is the only screen without a session", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("auth-screen")).toBeVisible();
  await expect(page.getByTestId("login-form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with GitHub" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Knowledge graph canvas" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login/);
});

test("login page renders sign-in and sign-up modes", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByTestId("login-form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();

  await page.getByTestId("signup-tab").click();
  await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
});
