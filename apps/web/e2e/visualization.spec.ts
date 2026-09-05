import { expect, test } from "./signed-in.ts";

test("lesson renders registered visualizations", async ({ page }) => {
  await page.goto("/nodes/networking.arp");
  await expect(page.getByTestId("visualization-network-packet-journey")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Путь пакета" })).toBeVisible();
});

test("renders interactive TCP handshake visualization", async ({ page }) => {
  await page.goto("/nodes/networking.tcp");
  const viz = page.getByTestId("visualization-network-tcp-handshake");
  await expect(viz).toBeVisible();
  await expect(viz.getByRole("heading", { name: "TCP 3-Way Handshake" })).toBeVisible();

  // Step forward
  await viz.getByRole("button", { name: "Далее" }).click();
  await expect(viz.getByText("Шаг 1: Пакет SYN")).toBeVisible();
});

test("renders interactive subnet calculator visualization", async ({ page }) => {
  await page.goto("/nodes/networking.subnetting");
  const viz = page.getByTestId("visualization-network-subnet-calculator");
  await expect(viz).toBeVisible();
  await expect(viz.getByText("255.255.255.0")).toBeVisible();
  await expect(viz.getByText("192.168.1.0 /24")).toBeVisible();
});
