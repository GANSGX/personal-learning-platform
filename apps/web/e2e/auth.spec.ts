import { expect, test } from "@playwright/test";

test("login is the only screen without a session", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("auth-screen")).toBeVisible();
  await expect(page.getByTestId("login-form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Продолжить с GitHub" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Холст графа знаний" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login/);
});

test("login page renders sign-in and sign-up modes", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByTestId("login-form")).toBeVisible();
  await expect(page.getByRole("button", { name: "Продолжить с GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Войти" })).toBeDisabled();

  await page.getByTestId("signup-tab").click();
  await expect(page.getByRole("button", { name: "Создать аккаунт" })).toBeDisabled();
});

test("language switcher changes login copy to English", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("locale-en").click();
  await expect(page.getByRole("button", { name: "Continue with GitHub" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sign in to open the map" })).toBeVisible();

  await page.getByTestId("locale-ru").click();
  await expect(page.getByRole("button", { name: "Продолжить с GitHub" })).toBeVisible();
});
