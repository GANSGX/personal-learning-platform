import { chromium } from "@playwright/test";

const PROJECT_REF = "xkkinckqidlsbuxhhayz";
const PROFILE = process.env["SUPABASE_CHROME_PROFILE"] ?? "/tmp/chrome-agent-profile";
const SITE_URL = "https://personal-learning-platform.pages.dev";
const REDIRECT_URLS = [
  "http://localhost:3000/**",
  "https://personal-learning-platform.pages.dev/**",
  "https://*.personal-learning-platform.pages.dev/**",
];

async function dismissNotice(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[class*="fixed bottom-4"]').forEach((element) => {
      element.remove();
    });
  });
}

async function addRedirectUrl(page, url) {
  await dismissNotice(page);
  await page.getByRole("button", { name: "Add URL", exact: true }).click({ force: true });
  await page.waitForTimeout(500);
  await page.locator('input[name="urls.0.value"]').fill(url);
  await page.getByRole("button", { name: "Save URLs" }).click();
  await page.waitForTimeout(1500);
}

async function main() {
  const context = await chromium.launchPersistentContext(PROFILE, {
    headless: true,
    channel: "chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = context.pages()[0] ?? (await context.newPage());

  try {
    await page.goto(
      `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration`,
      { waitUntil: "networkidle", timeout: 120000 },
    );

    if (page.url().includes("sign-in")) {
      console.error("Supabase dashboard is not logged in. Open the profile in Chrome first.");
      process.exit(2);
    }

    await dismissNotice(page);
    await page.locator('input[name="SITE_URL"]').fill(SITE_URL);

    const saveSite = page
      .locator('input[name="SITE_URL"]')
      .locator("xpath=ancestor::form[1]")
      .getByRole("button", { name: "Save changes" });

    if (await saveSite.isEnabled()) {
      await saveSite.click();
      await page.waitForTimeout(1500);
      console.log("SITE_URL saved:", SITE_URL);
    }

    for (const url of REDIRECT_URLS) {
      await page.reload({ waitUntil: "networkidle" });
      await dismissNotice(page);
      const body = await page.locator("body").innerText();

      if (body.includes(url)) {
        console.log("redirect exists:", url);
        continue;
      }

      await addRedirectUrl(page, url);
      console.log("redirect added:", url);
    }
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
