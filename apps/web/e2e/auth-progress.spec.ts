import { expect, test } from "@playwright/test";

const email = process.env["E2E_USER_EMAIL"];
const password = process.env["E2E_USER_PASSWORD"];

test.describe("Cloud Auth Progress Smoke", () => {
  test.skip(
    !email || !password,
    "Skipping live cloud auth smoke: E2E_USER_EMAIL and E2E_USER_PASSWORD secrets are not configured.",
  );

  test("signs in with credentials, marks theory progress, and persists across reload", async ({
    page,
  }) => {
    if (!email || !password) {
      return;
    }

    await page.goto("/login");

    await expect(page.getByTestId("login-form")).toBeVisible();

    await page.fill("#email", email);
    await page.fill("#password", password);

    const submitButton = page.getByRole("button", { name: /войти|sign in/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // After sign-in, user is redirected to the home knowledge map
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId("app-shell")).toBeVisible();

    // Navigate to a foundation lesson
    await page.goto("/nodes/networking.network-basics");
    await expect(page.getByTestId("lesson-title")).toBeVisible();

    const markTheoryButton = page.getByTestId("lesson-mark-theory-complete");
    await expect(markTheoryButton).toBeVisible();

    // Click mark theory if not already marked
    if (await markTheoryButton.isEnabled()) {
      await markTheoryButton.click();
    }

    // Button should now indicate completion and become disabled
    await expect(markTheoryButton).toBeDisabled();

    // Reload page to verify cloud progress persistence
    await page.reload();

    await expect(page.getByTestId("lesson-title")).toBeVisible();
    await expect(page.getByTestId("lesson-mark-theory-complete")).toBeDisabled();
  });
});
