import { expect, test } from "./signed-in.ts";

test("lesson renders registered visualizations", async ({ page }) => {
  await page.goto("/nodes/fixture.alpha");
  await expect(page.getByTestId("visualization-network-packet-journey")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Packet journey" })).toBeVisible();
});
