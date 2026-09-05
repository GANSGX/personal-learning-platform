import { expect, test } from "./signed-in.ts";

test.describe("visual regression", () => {
  test("knowledge map canvas visual baseline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("app-shell")).toBeVisible();
    await expect(page.getByTestId("graph-node-networking.network-basics")).toBeVisible();
    await expect(page.getByTestId("graph-canvas")).toHaveScreenshot("graph-canvas.png", {
      maxDiffPixelRatio: 0.05,
      animations: "disabled",
    });
  });

  test("node side panel visual baseline", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("graph-node-networking.network-basics").click();
    await expect(page.getByTestId("node-side-panel")).toBeVisible();
    await expect(page.getByTestId("node-side-panel")).toHaveScreenshot("node-side-panel.png", {
      maxDiffPixelRatio: 0.05,
      animations: "disabled",
    });
  });

  test("lesson route visual baseline", async ({ page }) => {
    await page.goto("/nodes/networking.arp");
    await expect(page.getByTestId("lesson-title")).toBeVisible();
    await expect(page.getByTestId("visualization-network-packet-journey")).toBeVisible();
    await expect(page.locator("main")).toHaveScreenshot("lesson-view.png", {
      maxDiffPixelRatio: 0.05,
      animations: "disabled",
    });
  });

  test("mobile responsive app shell visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.getByTestId("app-shell")).toBeVisible();
    await expect(page).toHaveScreenshot("app-shell-mobile.png", {
      maxDiffPixelRatio: 0.05,
      animations: "disabled",
    });
  });
});
